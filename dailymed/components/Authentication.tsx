import React, { useState, useEffect } from 'react'
import { User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { useCustomToast } from '@/components/ToasterProvider'
import AccountSettingsDialog from '@/components/AccountSettingsDialog'
import api from '@/utils/api'


// Custom useMediaQuery hook
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    media.addListener(listener)
    return () => media.removeListener(listener)
  }, [matches, query])

  return matches
}

const useAuth = () => {
  const showToast = useCustomToast()

  const handleLogin = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if(response.status === 200) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.data.user_id,
          email: response.data.email,
          name: response.data.name
        }));
        showToast('Log in successful!', 'success')
        return true;
      } else {
        showToast(response.data.message || 'Log in failed', 'error')
        return false;
      }
    } catch (error) {
      showToast('An unexpected error occurred', 'error')
      return false;
    }
  };

  const handleRegister = async (email, name, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password }),
      });
      const data = await response.json();
      if (response.ok) {
        showToast('Registration successful!', 'success')
        return true;
        
      } else {
        showToast(data.message || 'Log in failed', 'error')
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);  
      return false;
    }
  };

  return { handleLogin, handleRegister };
};

type LoginFormProps = {
  onSubmit: (email: string, password: string) => void;
  onSwitchToRegister: () => void;
  onGoogleLoginSuccess: () => void;
};

const LoginForm = ({ onSubmit, onSwitchToRegister, onGoogleLoginSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const showToast = useCustomToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  const handleGoogleLogin = () => {
    const width = 500;
    const height = 600;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);

    const popup = window.open(
      'http://localhost:5000/api/auth/login/google',
      'GoogleLogin',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (popup) {
      window.addEventListener('message', async (event) => {
        if (event.origin !== 'http://localhost:5000') return;

        if (event.data.type === 'GOOGLE_LOGIN_SUCCESS') {
          popup.close();
          localStorage.setItem('token', event.data.token);
          showToast('Google login successful!', 'success');
          onGoogleLoginSuccess();

        } else if (event.data.type === 'GOOGLE_LOGIN_FAILURE') {
          popup.close();
          showToast(event.data.message || 'Google login failed', 'error');
        }
      });
    } else {
      showToast('Unable to open popup window. Please check your browser settings.', 'error');
    }
  };

  return (
    <form className="py-4" onSubmit={handleSubmit}>
      <div className="grid gap-4">
        <Input
          type="email"
          id="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          id="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Log in</Button>
        <Button type="button" onClick={handleGoogleLogin} className="bg-accent hover:bg-accent/80 text-gray-700 border border-gray-300">
          <img src="/google-icon.webp" alt="Google" className="w-6 h-6 mr-2" />
          Sign in with Google
        </Button>
        <p className="text-sm text-center">
          Not yet registered?{' '}
          <button
            type="button"
            className="text-primary underline"
            onClick={onSwitchToRegister}
          >
            Create an account
          </button>
        </p>
      </div>
    </form>
  )
}

type RegisterFormProps = {
  onSubmit: (email: string, name: string, password: string) => void;
  onSwitchToLogin: () => void;
};

const RegisterForm = ({ onSubmit, onSwitchToLogin }: RegisterFormProps) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.error("Passwords don't match");
      return;
    }
    onSubmit(email, name, password);
  };

  return (
    <form className="py-4" onSubmit={handleSubmit}>
      <div className="grid gap-4">
        <Input
          type="email"
          id="register-email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          id="name"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="password"
          id="register-password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          type="password"
          id="confirm-password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button type="submit">Register</Button>
        <p className="text-sm text-center">
          Already have an account?{' '}
          <button
            type="button"
            className="text-primary underline"
            onClick={onSwitchToLogin}
          >
            Log in
          </button>
        </p>
      </div>
    </form>
  )
}

const AuthComponent = ({ initialMode = 'login' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState(initialMode)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { handleLogin, handleRegister } = useAuth()
  const showToast = useCustomToast()

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    setIsOpen(false)
    showToast('Logged out successfully', 'success')
  }

  const onLoginSubmit = async (email, password) => {
    const success = await handleLogin(email, password)
    if (success) {
      setIsLoggedIn(true)
      setIsOpen(false)
    }
  }

  const onRegisterSubmit = async (email, name, password) => {
    const success = await handleRegister(email, name, password)
    if (success) {
      setIsLoggedIn(true)
      setIsOpen(false)
    }
  }

  const onGoogleLoginSuccess = () => {
    setIsLoggedIn(true)
    setIsOpen(false)
  }

  const content = isLoggedIn ? (
    <AccountSettingsDialog onLogout={handleLogout} />
  ) : (
    <>
      <DialogHeader>
        <img src="/full-logo.svg" alt="DailyMed Logo" className="h-14 w-auto m-3 justify-center" />
        <DialogTitle>{mode === 'login' ? 'Log in' : 'Create an account'}</DialogTitle>
        <DialogDescription>
          {mode === 'login' 
            ? 'Enter your credentials to access your account.' 
            : 'Fill in the details below to create your account.'}
        </DialogDescription>
      </DialogHeader>
      {mode === 'login' ? (
        <LoginForm 
          onSubmit={onLoginSubmit} 
          onSwitchToRegister={() => setMode('register')} 
          onGoogleLoginSuccess={onGoogleLoginSuccess}

        />
      ) : (
        <RegisterForm 
          onSubmit={onRegisterSubmit} 
          onSwitchToLogin={() => setMode('login')} 
        />
      )}
    </>
  )

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="text-primary">
            <User className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          {content}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="text-primary">
          <User className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{isLoggedIn ? 'Account Settings' : (mode === 'login' ? 'Log in' : 'Create an account')}</DrawerTitle>
          {!isLoggedIn && (
            <DrawerDescription>
              {mode === 'login' 
                ? 'Enter your credentials to access your account.' 
                : 'Fill in the details below to create your account.'}
            </DrawerDescription>
          )}
        </DrawerHeader>
        {content}
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default AuthComponent;

export { AuthComponent };