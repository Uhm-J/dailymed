import React from 'react';
import styled from 'styled-components';
import { Dna } from 'lucide-react';
import Link from 'next/link';
import GlowingBorder from './GlowingBorder';

interface SubjectCardProps {
  SubjectName: string;
  SubjectId: string;
  subheading: string;
  description: string;
  color: string;
  icon: string;
}

const CardWrapper = styled.div`
  min-width: 300px;
  width: 100%;
  position: relative;
`;

const CardContent = styled.div<{ $color: string }>`
  background-color: transparent;
  padding: 32px;
  border: 2px solid --primary/80;};
  border-radius: 12px;
  transition: transform 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: scale(1.05);
  }
`;

const Title = styled.h3`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  font-family: 'Kameron', serif;
  margin-bottom: 0.75rem;
`;

const Question = styled.p`
  
  font-size: 1.1rem;
  font-weight: 600;
  font-family: 'Kameron', serif;
  margin-bottom: 0.75rem;
`;

const Description = styled.p`
  
  font-size: 1rem;
  margin-bottom: 1.5rem;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background-color: var(--primary/80);
  border-radius: 12px;
  margin-top: auto;
`;

const SubjectCard: React.FC<SubjectCardProps> = ({ SubjectName, SubjectId, subheading, description, color, icon }) => {
  const IconComponent = Dna;

  return (
    <CardWrapper>
      <GlowingBorder animationDuration={5} borderWidth={3} borderRadius={12}>
        <CardContent $color={color}>
          <Title>{SubjectName}</Title>
          <Question>{subheading}</Question>
          <Description>{description}</Description>
          <IconWrapper>
            <IconComponent size={40} />
          </IconWrapper>
        </CardContent>
        <Link href={`/quiz/${SubjectId}`} legacyBehavior passHref>
          <a aria-label={SubjectName} style={{ position: 'absolute', inset: 0 }} />
        </Link>
      </GlowingBorder>
    </CardWrapper>
  );
};

export default SubjectCard;