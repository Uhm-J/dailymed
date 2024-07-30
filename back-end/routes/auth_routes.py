from flask import Blueprint, request, jsonify, redirect, url_for
from flask_bcrypt import Bcrypt
from models import db, User
import jwt
import datetime
from google.oauth2 import id_token
from google.auth.transport import requests as google_auth_requests
import requests
import json
import os
from oauthlib.oauth2 import WebApplicationClient

auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()

GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'  # !!! Allow http for development but not for production environment


client = WebApplicationClient(GOOGLE_CLIENT_ID)

def get_google_provider_cfg():
    return requests.get("https://accounts.google.com/.well-known/openid-configuration").json()

@auth_bp.route('/login/google')
def google_login():
    try:
        # Redirect to Google's OAuth 2.0 server
        google_provider_cfg = get_google_provider_cfg()
        authorization_endpoint = google_provider_cfg["authorization_endpoint"]
        request_uri = client.prepare_request_uri(
            authorization_endpoint,
            redirect_uri=request.base_url + "/callback",
            scope=["openid", "email", "profile"],
        )
        return redirect(request_uri)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/login/google/callback')
def google_callback():
    try:
        # Get authorization code Google sent back
        code = request.args.get("code")

        # Find out what URL to hit to get tokens
        google_provider_cfg = get_google_provider_cfg()
        token_endpoint = google_provider_cfg["token_endpoint"]

        # Prepare and send a request to get tokens
        token_url, headers, body = client.prepare_token_request(
            token_endpoint,
            authorization_response=request.url,
            redirect_url=request.base_url,
            code=code
        )
        token_response = requests.post(
            token_url,
            headers=headers,
            data=body,
            auth=(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET),
        )

        # Parse the tokens
        client.parse_request_body_response(json.dumps(token_response.json()))

        # Get the user's profile information
        userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
        uri, headers, body = client.add_token(userinfo_endpoint)
        userinfo_response = requests.get(uri, headers=headers, data=body)

        # Verify the user's email
        if userinfo_response.json().get("email_verified"):
            unique_id = userinfo_response.json()["sub"]
            users_email = userinfo_response.json()["email"]
            users_name = userinfo_response.json()["given_name"]
        else:
            return "User email not available or not verified by Google.", 400

        # Create a user in your db with the information provided by Google
        user = User.query.filter_by(email=users_email).first()
        if not user:
            user = User(email=users_email, name=users_name, google_id=unique_id)
            db.session.add(user)
            db.session.commit()

        # Generate JWT token
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
        }, 'your-secret-key', algorithm='HS256')

        success_script = f"""
        <script>
            window.opener.postMessage({{
                type: 'GOOGLE_LOGIN_SUCCESS',
                token: '{token}',
                user_id: {user.id},
                email: '{user.email}',
                name: '{user.name}'
            }}, 'http://localhost:3000');
            window.close();
        </script>
        """
        return success_script

    except Exception as e:
        error_script = f"""
        <script>
            window.opener.postMessage({{
                type: 'GOOGLE_LOGIN_FAILURE',
                message: 'Login failed: {str(e)}'
            }}, 'http://localhost:3000');
            window.close();
        </script>
        """
        return error_script

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if user already exists
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({"message": "User already exists"}), 400
    
    # Hash the password
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    
    # Create new user
    new_user = User(email=data['email'], password=hashed_password, name=data['name'])
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message": "User created successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    print(data.get('password'))
    if user and bcrypt.check_password_hash(user.password, data['password']):
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
        }, 'your-secret-key', algorithm='HS256')
        
        return jsonify({
            "token": token,
            "user_id": user.id,
            "email": user.email,
            "name": user.name
        }), 200
    
    return jsonify({"message": "Invalid credentials"}), 401