export interface ILocalStorage {
  setItem: (key: string, value: string) => void;
  getItem: (key: string) => string | undefined | null;
  removeItem: (key: string) => boolean;
  clear: () => void;
}

const localStoragePolyfill = (): ILocalStorage => {
  const isLocalStorageAvailable = !!window.localStorage;
  let data = {} as { [key: string]: string };

  const setItem = (key: string, value: string) => {
    if (isLocalStorageAvailable) {
      return window.localStorage.setItem(key, value);
    }
    data[key] = value;
  };

  const getItem = (key: string) => {
    if (isLocalStorageAvailable) {
      return window.localStorage.getItem(key);
    }
    return data[key];
  };

  const removeItem = (key: string) => {
    if (isLocalStorageAvailable) {
      window.localStorage.removeItem(key);
      return true;
    }
    if (data[key]) {
      delete data[key];
      return true;
    }
    return false;
  };

  const clear = () => {
    if (isLocalStorageAvailable) {
      return window.localStorage.clear();
    }
    data = Object.assign({});
  };

  return {
    clear,
    removeItem,
    setItem,
    getItem,
  };
};

export { localStoragePolyfill };
