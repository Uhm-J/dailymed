import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QuestionReview from './QuestionReview';

interface QuizData {
  quizID: string;
  subjectName: string;
  subjectId: string;
  questions: Array<{
    questionNumber: number;
    questionText: string;
    answerOptions: string[];
    correctAnswer: string;
    correctAnswerIndex: number;
    hint: string;
    explanation: string;
  }>;
}

interface ResultsProps {
  score: number;
  quizData: QuizData;
  userAnswers: number[];
}

const Results: React.FC<ResultsProps> = ({ score, quizData, userAnswers }) => {
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [submittedFeedback, setSubmittedFeedback] = useState<number[]>([]);

  const handleQuestionClick = (questionNumber: number) => {
    setSelectedQuestion(questionNumber);
  };

  const handleFeedbackSubmitted = (questionNumber: number) => {
    setSubmittedFeedback(prev => [...prev, questionNumber]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-subtleBackground mb-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Quiz Completed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-4xl font-bold">Score: {score}</p>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {quizData.questions.map((question, index) => (
              <Button
                key={question.questionNumber}
                onClick={() => handleQuestionClick(index)}
                className={`${userAnswers[index] === question.correctAnswerIndex ? 'bg-correct-med' : 'bg-incorrect-med'}`}
              >
                Question {question.questionNumber}
              </Button>
            ))}
          </div>
          <div className="flex justify-end">
            <Link href="/" passHref>
              <Button className="w-auto bg-accent hover:bg-accent/80">Return to Home</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      
      {selectedQuestion !== null && (
        <QuestionReview
        quizId={quizData.quizID}
          question={quizData.questions[selectedQuestion]}
          userAnswer={userAnswers[selectedQuestion]}
          onClose={() => setSelectedQuestion(null)}
          feedbackSubmitted={submittedFeedback.includes(quizData.questions[selectedQuestion].questionNumber)}
          onFeedbackSubmitted={handleFeedbackSubmitted}
        />
      )}
    </div>
  );
};

export default Results;