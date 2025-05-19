import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from './useAuthContext';
import AuthLayout from '../Pages/layouts/AuthLayout';

interface GuestGuardProps {
  children: ReactNode;
}

export default function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, isInitialized } = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (!isInitialized) {
    // Bu aşamada örneğin bir yükleniyor göstergesi döndürebilirsiniz
    return null;
  }

  return <>{children}</>;
}
