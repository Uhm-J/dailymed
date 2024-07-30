import api from '../utils/api';

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

export async function getQuizData(subjectId: string): Promise<QuizData | { message: string, status: number }> {
  try {
    const response = await api.get(`/quiz/${subjectId}`);
    console.log('Quiz data:', response.data);
    
    if (response.data.status === 407) {
      return {
        message: response.data.message,
        status: response.data.status
      };
    }
    
    return response.data;
  } catch (error) {
    console.error('Error getting quiz data:', error);
    throw error;
  }
}