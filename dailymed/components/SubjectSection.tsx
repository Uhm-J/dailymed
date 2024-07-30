
import React from 'react';
import SubjectCard from './SubjectCard';
import Container from './Container';
import { useSubjects } from '@/contexts/SubjectsContext';
import LoadingSpinner from './LoadingSpinner';



const SubjectsSection = () => {
  const { subjects, isLoading } = useSubjects();

  if (subjects.length === 0) {
    return (
      <section className="py-12">
        <Container>
          <h2 className="text-3xl font-bold font-kameron text-center mb-8 text-primary/80">Subjects</h2>
          <LoadingSpinner />
        </Container>
      </section>
    );
  }

  return (
    <section className="py-12">
    <Container>
      <h2 className="text-3xl font-bold font-kameron text-center mb-8 text-primary/80">Subjects</h2>
      <div className="flex justify-center">
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl">
        {subjects.map((subject) => (
          <SubjectCard key={subject.name} {...subject} />
        ))}
      </div>
    </div>
    </Container>
  </section>
  );
};

export default SubjectsSection;