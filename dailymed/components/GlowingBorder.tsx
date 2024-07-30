import React from 'react';
import styled, { keyframes } from 'styled-components';

interface GlowingBorderProps {
  borderGradient?: string;
  glowColor?: string;
  animationDuration?: number;
  borderWidth?: number;
  borderRadius?: number;
  className?: string;
}

const defaultGradient = 'linear-gradient(90deg, #DFE9ED 0%, #F1BA6D 25%, #57B5A6 50%, #16443C80 75%, #DFE9ED 100%)';

const flowAnimation = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
`;

const BorderContainer = styled.div<{
  $borderGradient: string;
  $glowColor: string;
  $animationDuration: number;
  $borderWidth: number;
  $borderRadius: number;
}>`
  position: relative;
  border-radius: ${props => props.$borderRadius}px;
  transition: transform 0.3s ease;

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: -${props => props.$borderWidth}px;
    border-radius: inherit;
    background: ${props => props.$borderGradient};
    background-size: 200% 100%;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &::before {
    z-index: -1;
  }

  &::after {
    filter: blur(${props => props.$borderWidth * 2}px);
    z-index: -2;
  }

  &:hover::before,
  &:hover::after {
    opacity: 1;
    animation: ${flowAnimation} ${props => props.$animationDuration}s linear infinite;
  }

  &:hover {
    transform: scale(1.05);
  }
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 1;
`;

const GlowingBorder: React.FC<GlowingBorderProps & { children: React.ReactNode }> = ({
  children,
  borderGradient = defaultGradient,
  glowColor,
  animationDuration = 3,
  borderWidth = 2,
  borderRadius = 8,
  className,
}) => {
  return (
    <BorderContainer
      $borderGradient={borderGradient}
      $glowColor={glowColor || borderGradient}
      $animationDuration={animationDuration}
      $borderWidth={borderWidth}
      $borderRadius={borderRadius}
      className={className}
    >
      <ContentContainer>
        {children}
      </ContentContainer>
    </BorderContainer>
  );
};

export default GlowingBorder;