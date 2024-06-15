import { AppConstants } from '@/Constants/AppConstants';

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  // Example: at least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
};

export const AuthUtil = {
  signUp: async (name, email, password) => {
    try {
      if (!name || !name.trim() || !email || !password) {
        throw new Error('Please enter your name, email address, and password');
      }
      if (!isValidEmail(email)) {
        throw new Error('Please enter a valid email address');
      }
      if (!isValidPassword(password)) {
        throw new Error(
          'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, and one number'
        );
      }

      const url = AppConstants.URLS.AUTH_SERVICE_URL_V1 + '/signup';
      const reqOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      };
      const req = await fetch(url, reqOptions);
      if (req.status === 201) {
        const res = await req.json();
        return res;
      } else {
        const res = await req.json();
        throw new Error(res.error);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  },
  signIn: async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error('Please enter your email address and password');
      }
      if (!isValidEmail(email)) {
        throw new Error('Please enter a valid email address');
      }

      const url = AppConstants.URLS.AUTH_SERVICE_URL_V1 + '/signin';
      const reqOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      };
      const req = await fetch(url, reqOptions);
      if (req.status === 200) {
        const res = await req.json();
        return res;
      } else {
        const res = await req.json();
        throw new Error(res.error);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  },
  signOut: async () => {
    try {
      const url = AppConstants.URLS.AUTH_SERVICE_URL_V1 + '/signout';
      const reqOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const req = await fetch(url, reqOptions);
      if (req.ok) {
        const res = await req.json();
        return res;
      } else {
        const res = await req.json();
        throw new Error(res.error);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
