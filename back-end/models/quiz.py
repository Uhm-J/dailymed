# models/quiz.py
from . import db
from datetime import datetime

class Subject(db.Model):
    subjectID = db.Column(db.String, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.Text)
    endpoint = db.Column(db.Text)
    subheading = db.Column(db.Text)
    icon = db.Column(db.Text)
    quizzes = db.relationship('Quiz', backref='subject_ref', lazy=True)

    def to_dict(self):
        return {
            'SubjectId': self.subjectID,
            'SubjectName': self.name,
            'description': self.description,
            'endpoint': self.endpoint,
            'subheading': self.subheading,
            'icon': self.icon
        }


class Quiz(db.Model):
    quizID = db.Column(db.String, primary_key=True)
    subjectID = db.Column(db.String, db.ForeignKey('subject.subjectID'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    sourceFile = db.Column(db.String, nullable=False)
    questions = db.relationship('Question', backref='quiz', lazy=True)
    is_published = db.Column(db.Boolean, nullable=False)


    quiz_attempts = db.relationship('QuizAttempt', back_populates='quiz', lazy='dynamic')
    feedbacks = db.relationship('Feedback', back_populates='quiz', lazy=True)


    def to_dict(self):
        subject = Subject.query.get(self.subjectID)
        return {
            'quizID': self.quizID,
            'subjectName': subject.name if subject else None,
            'subjectId': self.subjectID,
            'questions': [question.to_dict_quiz() for question in self.questions]
        }

class Question(db.Model):
    quizID = db.Column(db.String, db.ForeignKey('quiz.quizID'), primary_key=True)
    questionNumber = db.Column(db.Integer, primary_key=True)
    questionText = db.Column(db.Text, nullable=False)
    answerOptions = db.Column(db.ARRAY(db.String), nullable=False)
    correctAnswer = db.Column(db.String, nullable=False)
    correctAnswerIndex = db.Column(db.Integer, nullable=False)
    hint = db.Column(db.Text)
    explanation = db.Column(db.Text)
    sources = db.Column(db.Text)
    grade = db.Column(db.String, nullable=False)
    gradeReason = db.Column(db.Text)

    def to_dict_quiz(self):
        return {
            'questionNumber': self.questionNumber,
            'questionText': self.questionText,
            'answerOptions': self.answerOptions,
            'correctAnswer': self.correctAnswer,
            'correctAnswerIndex': self.correctAnswerIndex,
            'hint': self.hint,
            'explanation': self.explanation
        }
    
    def to_dict(self):
        return {
            'quizID': self.quizID,
            'questionNumber': self.questionNumber,
            'questionText': self.questionText,
            'answerOptions': self.answerOptions,
            'correctAnswer': self.correctAnswer,
            'correctAnswerIndex': self.correctAnswerIndex,
            'hint': self.hint,
            'explanation': self.explanation,
            'sources': self.sources,
            'grade': self.grade,
            'gradeReason': self.gradeReason
        }

    def update_from_dict(self, data):
        for key, value in data.items():
            if hasattr(self, key):
                setattr(self, key, value)

    @classmethod
    def from_dict(cls, data):
        return cls(
            quizID=data.get('quizID'),
            questionNumber=data.get('questionNumber'),
            questionText=data.get('questionText'),
            answerOptions=data.get('answerOptions'),
            correctAnswer=data.get('correctAnswer'),
            correctAnswerIndex=data.get('correctAnswerIndex'),
            hint=data.get('hint'),
            explanation=data.get('explanation'),
            sources=data.get('sources'),
            grade=data.get('grade', ''),  # Provide a default value if not present
            gradeReason=data.get('gradeReason')
        )

class OriginalQuestion(db.Model):
    __tablename__ = 'original_question'
    quizID = db.Column(db.String, db.ForeignKey('quiz.quizID'), primary_key=True)
    questionNumber = db.Column(db.Integer, primary_key=True)
    questionText = db.Column(db.Text, nullable=False)
    answerOptions = db.Column(db.ARRAY(db.String), nullable=False)
    correctAnswer = db.Column(db.String, nullable=False)
    correctAnswerIndex = db.Column(db.Integer, nullable=False)
    hint = db.Column(db.Text)
    explanation = db.Column(db.Text)
    sources = db.Column(db.Text)
    ideas = db.Column(db.Text)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=True)  # Make password nullable
    name = db.Column(db.String(80), nullable=False)
    google_id = db.Column(db.String(120), unique=True, nullable=True)  # Add this line
    # quizAttempts = db.relationship('QuizAttempt', backref='user', lazy=True)
    feedbacks = db.relationship('Feedback', back_populates='user', lazy=True)


class QuizAttempt(db.Model):
    attemptID = db.Column(db.String, primary_key=True)
    user_id = db.Column(db.String, db.ForeignKey('user.id'), nullable=False)
    quizID = db.Column(db.String, db.ForeignKey('quiz.quizID'), nullable=False)
    score = db.Column(db.Integer)
    questionresults = db.Column(db.ARRAY(db.Integer))

    quiz = db.relationship('Quiz', back_populates='quiz_attempts')


    

    def to_dict(self):
        return {
            'attemptID': self.attemptID,
            'userID': str(self.user_id),
            'quizID': self.quizID,
            'date': self.quiz.date.isoformat(),
            'score': self.score,
            'questionresults': self.questionresults
        }
    

class Feedback(db.Model):
    feedbackID = db.Column(db.String, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    quizID = db.Column(db.String, db.ForeignKey('quiz.quizID'), nullable=False)
    questionNumber = db.Column(db.Integer, nullable=False)
    feedback = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    user = db.relationship('User', back_populates='feedbacks')
    quiz = db.relationship('Quiz', back_populates='feedbacks')

    # Add relationship to Question table
    question = db.relationship('Question', 
                               primaryjoin="and_(Feedback.quizID==Question.quizID, "
                                           "Feedback.questionNumber==Question.questionNumber)",
                               foreign_keys=[quizID, questionNumber],
                               backref=db.backref('feedback', lazy='dynamic'))

    def to_dict(self):
        return {
            'feedbackID': self.feedbackID,
            'userID': self.user_id,  # Changed from self.userID to self.user_id
            'quizID': self.quizID,
            'feedback': self.feedback,
            'questionNumber': self.questionNumber,
            'date': self.date.isoformat(),
            'question': self.question.to_dict() if self.question else None
        }

class EditLog(db.Model):
    __tablename__ = 'edit_log'
    id = db.Column(db.Integer, primary_key=True)
    quizID = db.Column(db.String, db.ForeignKey('quiz.quizID'), nullable=False)
    questionNumber = db.Column(db.Integer, nullable=False)
    field = db.Column(db.String, nullable=False)
    oldText = db.Column(db.Text, nullable=False)
    newText = db.Column(db.Text, nullable=False)
    reason = db.Column(db.String, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    user = db.Column(db.String, nullable=False)
    server_timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'quizID': self.quizID,
            'questionNumber': self.questionNumber,
            'field': self.field,
            'oldText': self.oldText,
            'newText': self.newText,
            'reason': self.reason,
            'timestamp': self.timestamp.isoformat(),
            'user': self.user,
            'server_timestamp': self.server_timestamp.isoformat()
        }