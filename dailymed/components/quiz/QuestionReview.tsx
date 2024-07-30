import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FeedbackForm from './FeedbackForm';


interface QuestionReviewProps {
  quizId: string;
  question: {
    questionNumber: number;
    questionText: string;
    answerOptions: string[];
    correctAnswer: string;
    correctAnswerIndex: number;
    hint: string;
    explanation: string;
  };
  userAnswer: number;
  onClose: () => void;
  feedbackSubmitted: boolean;
  onFeedbackSubmitted: (questionNumber: number) => void;
}

const QuestionReview: React.FC<QuestionReviewProps> = ({ 
  quizId,
  question, 
  userAnswer, 
  onClose, 
  feedbackSubmitted, 
  onFeedbackSubmitted 
}) => {
  const handleFeedbackSubmitted = () => {
    onFeedbackSubmitted(question.questionNumber);
  };

  return (
    <Card className="w-full bg-subtleBackground mb-4">
      <CardHeader className="flex flex-row items-start justify-between">
        <CardTitle className="text-xl font-bold">Question {question.questionNumber}</CardTitle>
        <div className="flex items-center space-x-2">
          <FeedbackForm 
            quizId={quizId}
            questionNumber={question.questionNumber}
            onFeedbackSubmitted={handleFeedbackSubmitted}
            disabled={feedbackSubmitted}
          />
          <Button onClick={onClose} variant="outline" size="sm">
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="font-semibold">{question.questionText}</p>
        
        {question.answerOptions.map((option, index) => (
          <div
            key={index}
            className={`p-2 rounded ${
              index === question.correctAnswerIndex
                ? 'bg-correct-med'
                : index === userAnswer
                ? 'bg-incorrect-med'
                : 'bg-gray-200'
            }`}
          >
            {option}
          </div>
        ))}
        
        <div className="mt-4">
          <h3 className="font-semibold">Explanation:</h3>
          <p>{question.explanation}</p>
        </div>
        
        <div className="mt-4">
          <h3 className="font-semibold">Hint:</h3>
          <p>{question.hint}</p>
        </div>
        
        {feedbackSubmitted && (
          <p className="text-sm text-green-600">Thank you for your feedback!</p>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionReview;