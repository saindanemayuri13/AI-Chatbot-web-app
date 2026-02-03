import { useState, useEffect } from 'react';
import { LoginPage } from '@/app/components/LoginPage';
import { RegisterPage } from '@/app/components/RegisterPage';
import { ChatPage } from '@/app/components/ChatPage';
import { LogoutPage } from '@/app/components/LogoutPage';

type Page = 'login' | 'register' | 'chat' | 'logout';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(user);
      setCurrentPage('chat');
    }
  }, []);

  const handleLogin = (username: string) => {
    localStorage.setItem('currentUser', username);
    setCurrentUser(username);
    setCurrentPage('chat');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setCurrentPage('logout');
  };

  const navigateToLogin = () => {
    setCurrentPage('login');
  };

  const navigateToRegister = () => {
    setCurrentPage('register');
  };

  return (
    <>
      {currentPage === 'login' && (
        <LoginPage onLogin={handleLogin} onNavigateToRegister={navigateToRegister} />
      )}
      {currentPage === 'register' && (
        <RegisterPage onNavigateToLogin={navigateToLogin} />
      )}
      {currentPage === 'chat' && currentUser && (
        <ChatPage username={currentUser} onLogout={handleLogout} />
      )}
      {currentPage === 'logout' && (
        <LogoutPage onNavigateToLogin={navigateToLogin} />
      )}
    </>
  );
}
