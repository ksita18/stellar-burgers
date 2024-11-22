import { useLocation, Navigate } from 'react-router-dom';
import { ReactElement } from 'react';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { getUserIsAuthChecked, getUser } from '../../services/slices/userSlice';

type TProtectedRouteProps = {
  children: ReactElement;
  onlyUnAuth?: boolean;
};

export function ProtectedRoute({ children, onlyUnAuth }: TProtectedRouteProps) {
  const isAuthChecked = useSelector(getUserIsAuthChecked);
  const user = useSelector(getUser);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return (
      <Navigate
        replace
        to='/login'
        state={{
          from: {
            ...location,
            background: location.state?.background,
            state: null
          }
        }}
      />
    );
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    const background = location.state?.from?.background || null;
    return <Navigate replace to={from} state={{ background }} />;
  }

  return children;
}
