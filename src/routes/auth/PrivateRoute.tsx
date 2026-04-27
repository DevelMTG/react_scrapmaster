import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom'; 
import { useAuth } from '../../features/auth/AuthContext';

export default function PrivateRoute({ children }: { readonly children: ReactNode }) {
//  const { user, loading } = useAuth();
  // 테스트용 
  const { user, loading } = { user: {}, loading: false };

  if (loading) {
    return <div>로그인 확인 중...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}