from flask import Flask
from flask_cors import CORS
from models import db
from routes.quiz_routes import quiz_bp
from routes.auth_routes import auth_bp
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)
    db.init_app(app)

    app.register_blueprint(quiz_bp)
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=False)