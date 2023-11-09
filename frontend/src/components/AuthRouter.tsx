import React from 'react';
import { Navigate } from 'react-router';

import LocalStorage from '@/utils/localStorage';

const AuthRouter: React.FC<any> = ({ children }) => {
  const token = LocalStorage.getAccessToken();
  const refreshToken = LocalStorage.getRefreshToken();

  if (token && refreshToken) return <Navigate to="/dashboard/matters" replace />;

  return <>{children}</>;
};

export default AuthRouter;
