# services/db_service.py

from models import db
from models.quiz import Subject, Quiz, Question, User, QuizAttempt, Feedback
from sqlalchemy.orm import joinedload
from datetime import datetime, date
import uuid

class QuizService:
    @staticmethod
    def get_all_subjects():
        return Subject.query.all()

    @staticmethod
    def get_subject(subject_id):
        Subjects = Subject.query.get(subject_id)
        print(Subjects)
        return Subject.query.get(subject_id)

    @staticmethod
    def get_todays_quiz(subject_id) :
        today = date.today()
        # today = 2024-07-16 formatted
        today = "2024-07-16"
        # today = today.strftime("%Y-%m-%d")
        return Quiz.query.filter_by(subjectID=subject_id, date=today).first()

    @staticmethod
    def get_or_create_user(user_id):
        user = User.query.get(user_id)
        if not user:
            user = User(userID=user_id)
            db.session.add(user)
            db.session.commit()
        return user

    @staticmethod
    def has_user_taken_quiz_today(user_id, subject_id):
        quiz_id = QuizService.get_todays_quiz(subject_id).quizID
        attempt = QuizAttempt.query.filter_by(
            user_id=user_id,
            quizID=quiz_id
        ).first()
        return attempt is not None

    @staticmethod
    def record_quiz_attempt(user_id, quiz_id, question_results, total_score):
        results_array = [r['isCorrect'] for r in question_results]
        results_array = [1 if r else 0 for r in results_array]
        print(results_array)
        attempt = QuizAttempt(
            attemptID=str(uuid.uuid4()),
            user_id=user_id,
            quizID=quiz_id,
            score=total_score,
            questionresults=results_array
        )
        db.session.add(attempt)
        db.session.commit()

    @staticmethod
    def submit_feedback(user_id, quiz_id, question_number, feedback_text):
        feedback = Feedback(
            feedbackID=str(uuid.uuid4()),
            user_id=user_id,
            quizID=quiz_id,
            questionNumber=question_number,
            feedback=feedback_text,
            date=datetime.now()
        )
        db.session.add(feedback)
        db.session.commit()