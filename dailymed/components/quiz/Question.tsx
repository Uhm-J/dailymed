import React from 'react';
import { Button } from "@/components/ui/button";

interface QuestionProps {
  question: {
    questionNumber: number;
    questionText: string;
    answerOptions: string[];
    correctAnswerIndex: number;
    hint: string;
  };
  onAnswer: (answerIndex: number) => void;
  userAnswer?: number;
  showExplanation: boolean;
}

const Question: React.FC<QuestionProps> = ({ question, onAnswer, userAnswer, showExplanation }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold font-kameron text-primary/80">Question {question.questionNumber}</h2>
      <p className="text-lg text-primary font-kameron">{question.questionText}</p>
      <div className="space-y-2">
        {question.answerOptions.map((option, index) => (
          <Button
          key={index}
          onClick={() => onAnswer(index)}
          disabled={showExplanation}
          variant={showExplanation 
            ? index === question.correctAnswerIndex 
              ? "correct" 
              : userAnswer === index 
                ? "incorrect" 
                : "muted"
            : userAnswer === index 
              ? "default" 
              : "quiz"
          }
          className="w-full justify-start text-left"
        >
          {option}
        </Button>
        ))}
      </div>
    </div>
  );
};

export default Question;