"use client";

import React from 'react';
import HeroSection from '@/components/HeroSection';
import Container from '@/components/Container';
import GradientSeparator from '@/components/GradientSeparator';
import SubjectsSection from '@/components/SubjectSection';
import AboutSection from '@/components/AboutSection';
import WorkflowSection from '@/components/WorkflowSection';

interface Subject {
  name: string;
  endpoint: string;
  description: string;
  subheading: string;
  icon: string;
  color: '';
}
interface MainPageProps {
  subjects: Subject[];
}

const MainPage: React.FC<MainPageProps> = () => {
  return (
    <div>
      <HeroSection />
      <GradientSeparator />
      <Container>
        {/* Other page content */}
        <SubjectsSection />
        {/* More content */}
      </Container>
      <GradientSeparator />
      <AboutSection id="about"/>
      <GradientSeparator />
      <WorkflowSection id="workflow"/>
      <GradientSeparator className='h-8' />
    </div>
  );
};

export default MainPage;