// ./dailymed/utils/sendFeedbackForm.tsx

import api from './api';

interface FeedbackForm {
  quizId: string;
  questionNumber: number;
  feedback: string;
}

export async function sendFeedbackForm(feedbackForm: FeedbackForm): Promise<void> {
  try {
    console.log('Submitting feedback:', feedbackForm);
    const response = await api.post('/quiz/feedback', feedbackForm);
    
    if (response.status === 200) {
      console.log('Feedback submitted successfully');
    } else {
      console.error('Failed to submit feedback');
    }
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
}