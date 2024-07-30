import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import GradientSeparator from '@/components/GradientSeparator';
import { User, Sun } from 'lucide-react';
import { Button } from "@/components/ui/button";
import NavigationMenu from '@/components/NavMenu';
import { AuthComponent  } from '@/components/Authentication';

const Header = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (headerRef.current) {
      const height = headerRef.current.offsetHeight;
      document.documentElement.style.setProperty('--header-height', `${height}px`);
    }
  }, []);

  const isQuizPage = pathname?.startsWith('/quiz/');

  return (
    <header ref={headerRef} className="bg-white opacity-90 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center space-x-2">
            <img src="/full-logo.svg" alt="DailyMed Logo" className="h-14 w-auto m-3" />
          </div>
        </Link>
        <nav className="flex items-center space-x-6">
          {!isQuizPage && <NavigationMenu />} {/* Only show the menu on non-quiz pages */}
          {!isQuizPage && <AuthComponent initialMode="login" />} {/* Only show the auth component on non-quiz pages */}
          <Button variant="outline" size="icon" className="text-primary">
            <Sun className="h-5 w-5" />
          </Button>
        </nav>
      </div>
      <GradientSeparator className="absolute bottom-0 left-0 right-0" />
    </header>
  );
};

export default Header;