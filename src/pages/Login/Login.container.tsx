
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../store/slices/authSlice';
import LoginComponent from './Login.component';

const LoginContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = (username: string, password: string) => {
    if (username === 'admin' && password === 'admin') {
      dispatch(login(username));
      navigate('/documents');
    } else {
      setError('Invalid credentials');
    }
  };

  return <LoginComponent onLogin={handleLogin} error={error} />;
};

export default LoginContainer;
