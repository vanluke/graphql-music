import { ILocalStorage } from './localstorage-polyfill';

export type User = {
  email: string;
  name: string;
};

export interface IAuthService {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
  user?: User;
  getToken: () => string | null | undefined;
}

const ENDPOINT = {
  login: 'http://localhost:3001/login', // POST
};

const TOKEN_KEY = 'auth';

class AuthService implements IAuthService {
  constructor(private storage: ILocalStorage) {}

  user?: User;

  isAuthenticated = () => {
    return !!this.storage.getItem(TOKEN_KEY);
  };

  login = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Email or password is not defined.');
    }
    try {
      const response = await fetch(ENDPOINT.login, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();
      this.storage.setItem(TOKEN_KEY, data.token);
      this.user = {
        email: 'email@email.com',
        name: '',
      }; // TODO: fetch user
    } catch (e) {
      console.error('Login error: ', e);
    }
  };

  logout = () => {
    try {
      this.storage.removeItem(TOKEN_KEY);
    } catch (e) {
      console.error('Logout error: ', e);
    }
  };
  getToken = () => {
    return this.storage.getItem(TOKEN_KEY);
  };
}

export default AuthService;
