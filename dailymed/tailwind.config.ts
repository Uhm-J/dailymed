import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        kameron: ['var(--font-kameron)'], // This uses the CSS variable we defined
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        teal: {
          600: '#38A89D', // Adjust this color if needed to match your design
        },
        hint: {
          DEFAULT: '#53AEA0',
          light: 'rgba(83, 174, 160, 0.25)',
        },
        incorrect: {
          DEFAULT: '#EC7C7C',
          light: 'rgba(236, 124, 124, 0.25)',
          med: 'rgba(236, 124, 124, 0.75)',
          high: 'rgba(236, 124, 124, 1)',
        },
        correct: {
          DEFAULT: '#76DB74',
          light: 'rgba(118, 219, 116, 0.25)',
          med: 'rgba(118, 219, 116, 0.75)',
        },
        textColor: '#181f13',
        backgroundColor: '#EDF5F8',
        subtleBackground: '#f0f5f5',
        primaryColor: '#033937',
        secondaryColor: '#43B6AF',
        accentColor: '#F3B96C',
        'gradient-1': '#DFE9ED',
        'gradient-2': '#57B5A6',
        'gradient-3': '#16443C',
        'gradient-4': '#F1BA6D',
        'gradient-5': '#DDE8EC',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config