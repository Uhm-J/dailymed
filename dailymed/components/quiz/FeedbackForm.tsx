import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Textarea } from '@/components/ui/textarea';
import { useCustomToast } from '@/components/ToasterProvider';
import { sendFeedbackForm } from '@/utils/sendFeedbackForm';
import { isCompositeComponent } from 'react-dom/test-utils';

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  React.useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
};


interface FeedbackFormProps {
  quizId: string;
  questionNumber: number;
  onFeedbackSubmitted: () => void;
  disabled?: boolean;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ 
  quizId,
  questionNumber,
  onFeedbackSubmitted,
  disabled = false
}) => {
   const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const showToast = useCustomToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendFeedbackForm({ quizId, questionNumber, feedback })
      .then(() => {
        console.log('Feedback submitted for question', questionNumber, ':', feedback);
        showToast('Feedback submitted successfully!', 'success');
        setFeedback('');
        setIsOpen(false);
        onFeedbackSubmitted();
      })
      .catch(() => {
        showToast('Failed to submit feedback. Please try again.', 'error');
      });
  };

  const content = (
    <>
      <DialogHeader>
        <DialogTitle>Feedback for Question {questionNumber}</DialogTitle>
        <DialogDescription>
          We appreciate your feedback. Please let us know your thoughts about this question.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Enter your feedback here..."
          className="w-full"
        />
        <Button type="submit">Send Feedback</Button>
      </form>
    </>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="w-auto bg-accent hover:bg-accent/80" disabled={disabled}>Send Feedback</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button className="w-auto bg-accent hover:bg-accent/80" disabled={disabled}>Send Feedback</Button>
      </DrawerTrigger>
      <DrawerContent>
        
        {content}
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default FeedbackForm;