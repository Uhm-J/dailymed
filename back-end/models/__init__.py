from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .quiz import Quiz, Question, OriginalQuestion, User, QuizAttempt, Feedback