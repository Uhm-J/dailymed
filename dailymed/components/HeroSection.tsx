import React from 'react';
import Container from './Container'; // Adjust the import path as needed
import Link from 'next/link'; 
import { AuthComponent } from '@/components/Authentication'; // Adjust the import path as needed
import { Button } from '@/components/ui/button'; // Adjust the import path as needed

const HeroSection = () => {
  return (
    <section className="py-12">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/3 space-y-4">
            <p className="text-sm font-semibold font-kameron text-primary uppercase">VERIFIED</p>
            <h1 className="text-4xl font-bold font-kameron text-primary">
              Medical Quizzes on Expert level
            </h1>
            <div className="flex flex-wrap space-x-5 pt-4 mr-5">
              <Link href="/#about" legacyBehavior passHref scroll={false}> 
              <button className="flex-none w-auto px-6 py-2 mt-5 bg-secondary/80 text-black rounded-full hover:bg-secondary/90 transition-colors">
                How does it work?
              </button>
              </Link>
              {/* <AuthComponent initialMode="register" />  */}
            </div>
          </div>
          <div className="md:w-2/3 mt-8 md:mt-0">
            <div className="bg-gray-200 w-auto h-128 flex items-center justify-center">
              <img src="/placeholder_hero.webp" alt="Hero Image" className="h-128" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;