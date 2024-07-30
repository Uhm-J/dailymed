from flask import Blueprint, jsonify, request, render_template, make_response, url_for
from datetime import datetime
import uuid

from auth.auth_middleware import login_required
from services.quiz_service import QuizService


quiz_bp = Blueprint('quiz', __name__)

def get_or_create_user_id():
    user_id = request.cookies.get('user_id')
    if not user_id:
        user_id = str(uuid.uuid4())
    return user_id

@quiz_bp.route('/api/init')
def init_page():
    print('Init page')
    subjects = QuizService.get_all_subjects()
    
    subject_data = jsonify([
        s.to_dict()
        for s in subjects  
    ])
    
    user_id = get_or_create_user_id()
    response = make_response(subject_data)
    response.set_cookie('user_id', user_id, max_age=60*60*24*365)  # Cookie expires in 1 year
    return response

@quiz_bp.route('/api/subjects')
def get_subjects():
    subjects = QuizService.get_all_subjects()
    return jsonify([subject.to_dict() for subject in subjects])


@quiz_bp.route('/api/quiz/<subject_id>')
@login_required
def get_quiz(current_user, subject_id):
    print('Get quiz')
    print(subject_id)
    print(current_user.id)
    quiz = QuizService.get_todays_quiz(subject_id)
    # check if user has already taken the quiz
    user_id = current_user.id
    has_taken_quiz = QuizService.has_user_taken_quiz_today(user_id, subject_id)
    if has_taken_quiz:
        pass
        #return jsonify({'message': 'You have already taken the quiz today.', "status": 407})

    return jsonify(quiz.to_dict())

@quiz_bp.route('/api/quiz/submit', methods=['POST'])
@login_required
def submit_quiz(current_user):
    user_id = current_user.id
    data = request.get_json()
    QuizService.record_quiz_attempt(user_id, data['quizId'], data['answers'], data['score'])
    return jsonify({'success': True})

@quiz_bp.route('/api/quiz/feedback', methods=['POST'])
@login_required
def submit_feedback(current_user):
    user_id = current_user.id
    data = request.get_json()
    print(data, user_id)
    QuizService.submit_feedback(
        user_id,
        data['quizId'],
        data['questionNumber'],
        data['feedback']
    )
    return jsonify({'success': True})