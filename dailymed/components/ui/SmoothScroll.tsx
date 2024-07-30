'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SmoothScroll = () => {
  const router = useRouter();

  useEffect(() => {

    const handleClick = (e: MouseEvent) => {
      let target = e.target as HTMLElement;
      
      // Traverse up the DOM tree to find the nearest link
      while (target && target !== document.body) {
        if (target.tagName === 'A' || (target.tagName === 'BUTTON' && target.hasAttribute('href'))) {
          const href = target.getAttribute('href');
          if (href?.startsWith('#')) {
            console.log('Link clicked:', href);
            e.preventDefault();
            const id = href.slice(1);
            const element = document.getElementById(id);
            if (element) {
              const yOffset = -60; // Adjust this value as needed
              const elementPosition = element.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset + yOffset;
              
              window.scrollBy({
                top: elementPosition + yOffset,
                behavior: 'smooth'
              });
            }
          } else if (href?.startsWith('/') && href.includes('#')) {
            // Handle internal links with hash
            e.preventDefault();
            const [path, hash] = href.split('#');
            router.push(path);
            setTimeout(() => {
              const element = document.getElementById(hash);
              if (element) {
                const yOffset = -60; // Adjust this value as needed
                const elementPosition = element.getBoundingClientRect().top;
                
                window.scrollBy({
                  top: elementPosition + yOffset,
                  behavior: 'smooth'
                });
              }
            }, 100); // Small delay to ensure the new page has loaded
          }
          break;
        }
        target = target.parentElement as HTMLElement;
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      console.log('SmoothScroll component unmounted');
      document.removeEventListener('click', handleClick);
    };
  }, [router]);

  return null;
};

export default SmoothScroll;