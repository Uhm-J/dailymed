import api from './api';

interface QuizResult {
  quizId: string;
  score: number;
  answers: {
    questionNumber: number;
    userAnswer: number;
    isCorrect: boolean;
  }[];
}

export async function sendQuizResults(quizResult: QuizResult): Promise<void> {
  try {
    const response = await api.post('/quiz/submit', quizResult);
    
    if (response.status === 200) {
      console.log('Quiz results submitted successfully');
    } else {
      console.error('Failed to submit quiz results');
    }
  } catch (error) {
    console.error('Error submitting quiz results:', error);
    throw error;
  }
}