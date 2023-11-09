import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router';
import { useNavigate } from 'react-router-dom';

import Loader from '@/components/Loader';

import { getActiveNoticesAction } from '@/store/actions/noticesActions';
import { getOrganisationServices } from '@/store/actions/servicesActions';
import { getMeAction } from '@/store/actions/userActions';

import { selectIsServicesLoading } from '@/store/selectors/servicesSelector';
import {
  selectIsLoadingUser,
  selectUser,
} from '@/store/selectors/userSelectors';

import useToggle from '@/hooks/useToggle';

import LocalStorage from '@/utils/localStorage';

const ProtectedRouter: React.FC<any> = ({ children }) => {
  const token = LocalStorage.getAccessToken();
  const refreshToken = LocalStorage.getRefreshToken();

  if (!token && !refreshToken) return <Navigate to="/sign-in" replace />;

  const [isFinished, toggleIsFinished] = useToggle(false);
  const [isLoadingGoogleMaps, setIsLoadingGoogleMaps] = useToggle(true);
  const dispatch = useDispatch<any>();
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectIsLoadingUser);
  const isServicesLoading = useSelector(selectIsServicesLoading);

  const navigate = useNavigate();

  useEffect(() => {
    getMe();
  }, []);

  const getMe = async () => {
    try {
      await dispatch(getMeAction());
    } catch (e) {
      return navigate('/sign-in', { replace: true });
    }
  };

  useEffect(() => {
    if (!isLoadingGoogleMaps) {
      return;
    }

    if (user) {
      const script = document.createElement('script');
      script.onload = () => {
        setIsLoadingGoogleMaps(false);
      };
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}&libraries=places`;
      document.head.appendChild(script);
    }
  }, [user, isLoadingGoogleMaps]);

  useEffect(() => {
    if (user) {
      getServices(user.organisations[0].id);
      dispatch(getActiveNoticesAction());
    }
  }, [user]);

  const getServices = async (id: number) => {
    await dispatch(getOrganisationServices(id));
    toggleIsFinished(true);
  };

  if ((isLoading && !isFinished) || isServicesLoading) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <Loader />
      </div>
    );
  }

  if (!isLoading && isFinished && !user) { return <Navigate to="/sign-in" replace />; }

  if (!isLoading && (!token || !refreshToken)) { return <Navigate to="/sign-in" replace />; }

  return (user && isFinished && !isLoadingGoogleMaps) ? (
    <>{children}</>
  ) : (
    <div style={{ minHeight: '100vh' }}>
      <Loader />
    </div>
  );
};

export default ProtectedRouter;
