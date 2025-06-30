import { setCookie, destroyCookie, parseCookies } from 'nookies';
import { useRouter } from 'next/navigation';

export const login = async (email, password) => {
  const BACKEND_URL= process.env.BACKEND_URL;
  const response = await fetch(`${BACKEND_URL}/api/loginuser/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    console.log('Failed to login');
  }

  else{

    const data = await response.json();
    
    // Set the cookies
    setCookie(null, 'token', data.token, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });
    setCookie(null, 'username', data.username, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });
    
    return data;
  }
};

export const logout = () => {
  // Destroy the cookies
  destroyCookie(null, 'token');
  destroyCookie(null, 'username');
};

export const useAuth = () => {
  const router = useRouter();
  const cookies = parseCookies();
  const token = cookies.token;
  const username = cookies.username;

  const handleLogin = async (email, password) => {
    try {
      const data = await login(email, password);
      router.push('/');
      return data;
    } catch (error) {
      console.error('Failed to login:', error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return { token, username, login: handleLogin, logout: handleLogout };
};
