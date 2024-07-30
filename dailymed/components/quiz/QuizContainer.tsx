import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';

import { Button } from "@/components/ui/button";
import Question from './Question';
import ProgressBar from './ProgressBar';
import Results from './Results';
import Timer from './Timer';
import { sendQuizResults } from '@/utils/sendQuizResults';
import { LightbulbIcon } from 'lucide-react';
import { getQuizData } from '@/utils/getQuizData';
import LoadingSpinner from '@/components/LoadingSpinner';

interface QuizContainerProps {
    subjectId: string;
  }

const QuizContainer: React.FC<QuizContainerProps> = ({ subjectId }) => {
    const [quizData, setQuizData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
    const [userAnswers, setUserAnswers] = useState<number[]>([]);
    const [correct, setCorrect] = useState<boolean[]>([]);
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [hintClicked, setHintClicked] = useState<boolean[]>([]);
    const [isAnswered, setIsAnswered] = useState(false);
    const [timeUp, setTimeUp] = useState(false);
    const [timerKey, setTimerKey] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);

    useEffect(() => {
        async function fetchQuizData() {
          try {
            const data = await getQuizData(subjectId);
            if ('status' in data && data.status === 407) {
              setError(data.message);
              setLoading(false);
              return;
            }
            if ('status' in data && data.status === 405) {
                setError(data.message);
                setLoading(false);
                return;
              }
            setQuizData(data);
            setCorrect(new Array(data.questions.length).fill(false));
            setHintClicked(new Array(data.questions.length).fill(false));
            setLoading(false);
          } catch (err) {
            console.error('Error fetching quiz data:', err);
            setError('Failed to load quiz data. Please try again later. Maybe you are not logged in?');
            setLoading(false);
          }
        }
        fetchQuizData();
      }, [subjectId]);

    
    const calculateQuestionScore = (answerIndex: number, timeRemaining: number) => {
        const isCorrect = answerIndex === quizData.questions[currentQuestionIndex].correctAnswerIndex;
        setCorrect(prevCorrect => {
            const newCorrect = [...prevCorrect];
            newCorrect[currentQuestionIndex] = isCorrect;
            return newCorrect;
        });


        const hintWasUsed = hintClicked[currentQuestionIndex];
        if (isCorrect) {
            if (hintWasUsed) {
                return 50;
            } else {
                return 100 + (timeRemaining * 2);
            }
        } else {
            if (hintWasUsed) {
                return -25;
            } else {
                return 0;
            }
        }
    };
  
    const handleAnswer = (answerIndex: number) => {
      if (isAnswered || timeUp) return;
      setIsAnswered(true);
      const newUserAnswers = [...userAnswers];
      newUserAnswers[currentQuestionIndex] = answerIndex;
      setUserAnswers(newUserAnswers);

      const questionScore = calculateQuestionScore(answerIndex, timeLeft);
      setScore(prevScore => prevScore + questionScore);
      setShowExplanation(true);
    };
  
    const handleNextQuestion = async () => {
      if (currentQuestionIndex < quizData.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setShowExplanation(false);
        setShowHint(false);
        setIsAnswered(false);
        setTimeUp(false);
        setTimerKey(prevKey => prevKey + 1);
      } else {
        setQuizCompleted(true);

        const quizResult = {
            quizId: quizData.quizID,
            score: score,
            answers: userAnswers.map((answer, index) => ({
              questionNumber: index + 1,
              userAnswer: answer,
              isCorrect: correct[index],
            })),
          };
      
          try {
            await sendQuizResults(quizResult);
          } catch (error) {
            console.error('Failed to send quiz results:', error);
          }
      }
    };
  
    const handleTimeUp = () => {
      if (!isAnswered && !timeUp) {
        setTimeUp(true);
        const newUserAnswers = [...userAnswers];
        newUserAnswers[currentQuestionIndex] = -1;
        setUserAnswers(newUserAnswers);
        setShowExplanation(true);
        const questionScore = calculateQuestionScore(currentQuestionIndex, 0);
        setScore(prevScore => prevScore + questionScore);
      }
    };


  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
  };

  const toggleHint = () => {
    if (!hintClicked[currentQuestionIndex]) {
      const newHintClicked = [...hintClicked];
      newHintClicked[currentQuestionIndex] = true;
      setHintClicked(newHintClicked);
      setShowHint(true);
    }
  };

  if (quizCompleted) {
    console.log(userAnswers, score, hintClicked);
    console.log(correct)
    // send score, correct, userAnswers to backend
    return <Results score={score} quizData={quizData} userAnswers={userAnswers} />;
}

const currentQuestion = quizData?.questions?.[currentQuestionIndex];

return (
    <div className="w-full max-w-6xl mx-auto min-h-[600px] flex flex-col">
      <div className="mb-4">
        <ProgressBar 
          current={currentQuestionIndex + 1} 
          total={quizData?.questions?.length ?? 0} 
        />
      </div>
      <Card className="w-full bg-subtleBackground shadow-lg flex-grow">
        <CardContent className="p-6 h-full flex flex-col">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-center text-red-500 mb-8">{error}</div>
              <Link href="/" passHref>
                <Button className="bg-accentColor text-textColor hover:bg-accentColor/80">
                  Go back
                </Button>
              </Link>
            </div>
          ) : !quizData ? (
            <div>No quiz data available.</div>
          ) : !quizStarted ? (
            <div className="text-center flex-grow flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-4 text-textColor font-kameron">{quizData.subjectName}</h2>
              <p className="mb-6 text-textColor font-kameron">
                *You will be doing an AI-generated quiz, this quiz has been reviewed by professionals, but there may still be mistakes in the questions and/or answers. In the results section there's an opportunity to provide feedback on these questions.
              </p>
              <Button onClick={startQuiz} className="bg-accentColor text-textColor hover:bg-accentColor/80 mx-auto">
                Start the Quiz!
              </Button>
            </div>
          ) : (
            <div className="flex h-full">
              <div className="w-2/3 pr-6 flex flex-col">
                {currentQuestion ? (
                  <Question
                    question={currentQuestion}
                    onAnswer={handleAnswer}
                    userAnswer={userAnswers[currentQuestionIndex]}
                    showExplanation={showExplanation}
                  />
                ) : (
                  <div>Loading question...</div>
                )}
              </div>
              <div className="w-1/3 pl-6 border-l border-secondaryColor flex flex-col">
                <div className="mb-4">
                  <Button 
                    onClick={toggleHint}
                    variant="hint"
                    className="w-full text-primaryColor flex items-center justify-end border-primaryColor"
                    disabled={hintClicked[currentQuestionIndex]}
                  >
                    <LightbulbIcon className="mr-2" size={18} />
                    Hint
                  </Button>
                </div>
                {showHint && currentQuestion && (
                  <div className="mb-4 p-4 bg-hint/20 rounded-lg">
                    <p className="text-primaryColor font-kameron">{currentQuestion.hint}</p>
                  </div>
                )}
                <div className="flex-grow"></div>
                {showExplanation && currentQuestion && (
                  <div className={`mb-4 p-4 ${userAnswers[currentQuestionIndex] === currentQuestion.correctAnswerIndex 
                        ? "bg-correct-med" : "bg-incorrect-med"} rounded-lg `}>
                    <h3 className="font-semibold font-kameron text-center text-primaryColor">
                      {userAnswers[currentQuestionIndex] === currentQuestion.correctAnswerIndex 
                        ? "Correct!" : "Incorrect"}
                    </h3>
                    <p className="text-primaryColor font-kameron">{currentQuestion.explanation}</p>
                  </div>
                )}
                <div className="mt-auto">
                  <Button 
                    onClick={handleNextQuestion} 
                    disabled={!showExplanation}
                    className="w-full bg-accentColor text-primaryColor/80 font-semibold hover:bg-accentColor/80"
                  >
                    {currentQuestionIndex < quizData.questions.length - 1 ? "Next Question >" : "Finish Quiz!"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {quizStarted && currentQuestion && (
      <div className="mb-4">
      <Timer 
                key={timerKey}
                initialTime={30}
                onTimeUp={handleTimeUp}
                isAnswered={isAnswered || timeUp}
                questionIndex={currentQuestionIndex}
                onTimeChange={(time) => setTimeLeft(time)}
              />
  </div>
    )}
    </div>
  );
};

export default QuizContainer;      