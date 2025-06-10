import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000';

const LoginSuccess = ({ setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      localStorage.setItem('token', token);

      axios
        .get(`${BACKEND_URL}/api/users/profile`, {  // <-- corretto qui
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          localStorage.setItem('user', JSON.stringify(res.data));
          setUser(res.data);        // aggiorna lo stato globale utente!
          navigate('/');
        })
        .catch(() => {
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [location, navigate, setUser]);

  return <p className="text-center mt-5">Accesso in corso...</p>;
};

export default LoginSuccess;
