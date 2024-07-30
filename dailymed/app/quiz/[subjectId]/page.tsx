"use client";

import React from 'react';
import QuizContainer from '@/components/quiz/QuizContainer';

export default function QuizPage({ params }: { params: { subjectId: string } }) {
  return (
    <main className="flex-grow flex items-center justify-center bg-background px-4 py-8">
      <QuizContainer subjectId={params.subjectId} />
    </main>
  );
}