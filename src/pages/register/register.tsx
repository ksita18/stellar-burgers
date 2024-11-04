import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useSelector } from '../../services/store';
import {
  getUserError,
  getUserIsAuthenticated,
  userActions
} from '../../services/slices/user';
import { useAction } from '../../hooks/useAction';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const error = useSelector(getUserError);
  const isAuthenticated = useSelector(getUserIsAuthenticated);
  const { registerUserThunk, loginUserThunk } = useAction(userActions);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    registerUserThunk({ name: userName, email, password });
    if (isAuthenticated) {
      loginUserThunk({ email, password });
    }
  };

  return (
    <RegisterUI
      errorText={error?.message}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
