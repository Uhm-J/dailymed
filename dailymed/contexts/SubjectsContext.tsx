// contexts/SubjectsContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';

interface Subject {
    SubjectName: string;
    SubjectId: string;
    description: string;
    subheading: string;
    icon: string;
    color: '';
  }

interface SubjectsContextType {
  subjects: Subject[];
  isLoading: boolean;
}

const SubjectsContext = createContext<SubjectsContextType>({ subjects: [], isLoading: true });

export const SubjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/init')
      .then(response => response.json())
      .then(data => {
        setSubjects(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching subjects:', error);
        setIsLoading(false);
      });
  }, []);

  return (
    <SubjectsContext.Provider value={{ subjects, isLoading }}>
      {children}
    </SubjectsContext.Provider>
  );
};

export const useSubjects = () => useContext(SubjectsContext);