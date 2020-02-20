import { localStoragePolyfill } from './localstorage-polyfill';
import AuthService from './AuthService';

const ls = localStoragePolyfill();

const authService = new AuthService(ls);

export { authService };
