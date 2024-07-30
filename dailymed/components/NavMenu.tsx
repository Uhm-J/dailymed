'use client';
import React from 'react';
import Link from 'next/link';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, NavigationMenuTrigger, NavigationMenuContent, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { useSubjects } from '@/contexts/SubjectsContext';

interface Subject {
  subjectId: string;
  subjectName: string;
}

const NavMenu = () => {
  const { subjects, isLoading } = useSubjects();

  return (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              Quiz Subjects
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              {subjects.map(subject => (
                <Link key={subject.SubjectName} href={`/quiz/${subject.SubjectId}`} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {subject.SubjectName}
                  </NavigationMenuLink>
                </Link>
              ))}
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/#about" legacyBehavior passHref scroll={false}>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                About
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/#workflow" legacyBehavior passHref scroll={false}>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Workflow
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
  };
  
  export default NavMenu;