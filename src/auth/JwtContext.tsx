/* AuthProvider.tsx */
import axios from "axios";
import { isValidToken, setSession } from './utils';
import localStorageAvailable from './localStorageAvailable';
import { createContext, useReducer, useCallback, useMemo, useEffect, ReactNode, Reducer } from 'react';
import { addUser, fetchProfile, firebaseLogin, register as registerWithFirebase } from "../services/userService";
import { parseJwt } from "../utils/utils";

// User yapısı projenizde hangi alanlar varsa ona göre genişletebilirsiniz
export interface IUser {
  id?: string;
  name?: string;
  lastname?: string;
  email?: string;
  password?: string;
  [key: string]: any;
}

export interface IUsage {
  // usage endpoint’inden dönen veriye göre düzenleyebilirsiniz
  [key: string]: any;
}

export interface ITemplate {
  // template/findAll endpoint’inden dönen veriye göre düzenleyebilirsiniz
  [key: string]: any;
}

// Auth State
interface AuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: IUser | null;
}

// Olası Action tipleri
type AuthAction =
  | {
    type: 'INITIAL';
    payload: {
      isAuthenticated: boolean;
      user: IUser | null;
    };
  }
  | {
    type: 'LOGIN';
    payload: {
      user: IUser;
    };
  }
  | {
    type: 'REGISTER';
    payload: {
      user: IUser;
    };
  }
  | {
    type: 'LOGOUT';
  };

// Context'te sağlanacak metotların tipi
interface AuthContextValue extends AuthState {
  method: 'jwt';
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    lastname: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

// Provider'a verilecek props
interface AuthProviderProps {
  children: ReactNode;
}


// 2) Başlangıç State’i
const initialState: AuthState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

// 3) Reducer
const reducer: Reducer<AuthState, AuthAction> = (state, action) => {
  switch (action.type) {
    case 'INITIAL':
      return {
        isInitialized: true,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
      };

    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case 'REGISTER':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

// 4) AuthContext oluşturma
export const AuthContext = createContext<AuthContextValue | null>(null);


// 5) AuthProvider Bileşeni
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const storageAvailable = localStorageAvailable();

  const initialize = useCallback(async () => {
    try {
      const accessToken = storageAvailable ? localStorage.getItem('accessToken') : '';

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const { user_id } = parseJwt(accessToken);
        const profile: any = await fetchProfile(user_id);

        const user: IUser = {
          id: profile.id,
          email: profile?.email,
          name: profile?.name,
          lastname: profile.lastname,
        };

        if (user) {
          dispatch({
            type: 'INITIAL',
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          dispatch({
            type: 'INITIAL',
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, [storageAvailable]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // login
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response: any = await firebaseLogin(email, password);
        const profile: any = await fetchProfile(response?.user?.uid);
        const accessToken = response.user.accessToken;

        const user = {
          id: profile.id,
          email: profile?.email,
          name: profile?.name,
          lastname: profile.lastname,
        }

        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
          setSession(accessToken);

          dispatch({
            type: 'LOGIN',
            payload: {
              user
            }
          });
        } else {
          window.location.href = "/login"
        }
      } catch (error: any) {
        // Hata mesajını fırlatın
        throw new Error(error?.errorMessage || 'Login error');
      }
    }, []);

  // refresh (token geçerli ise user bilgilerini tazele)
  const refresh = useCallback(async () => {
    const accessToken = storageAvailable ? localStorage.getItem('accessToken') : '';

    if (accessToken && isValidToken(accessToken)) {
      setSession(accessToken);
      const response = await axios.get('/auth/me');
      const user: IUser = response.data;

      localStorage.setItem('accessToken', accessToken);
      setSession(accessToken);

      dispatch({
        type: 'INITIAL',
        payload: {
          isAuthenticated: true,
          user,
        },
      });
    }
  }, [storageAvailable]);


  // register
  const register = useCallback(
    async (email: string, password: string, name: string, lastname: string) => {
      const response: any = await registerWithFirebase(email, password, { name, lastname });
      const profile: any = await fetchProfile(response?.uid);

      const user = {
        id: profile.id,
        email: profile?.email,
        name: profile?.name,
        lastname: profile.lastname,
      }

      if (response?.accessToken) {
        localStorage.setItem('accessToken', response?.accessToken);
        dispatch({
          type: 'REGISTER',
          payload: {
            user,
          },
        });
      } else {
        window.location.href = "/login";
      }
    }, []);


  // logout
  const logout = useCallback(() => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  }, []);


  // 6) Context Value
  const memoizedValue: AuthContextValue = useMemo(() => ({
    isInitialized: state.isInitialized,
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    method: 'jwt',
    login,
    register,
    logout,
    refresh,
  }), [state.isInitialized, state.isAuthenticated, state.user, login, register, logout, refresh]);

  // 7 Return
  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}