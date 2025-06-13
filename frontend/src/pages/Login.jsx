import React, { useState, useEffect } from 'react';
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  InputGroup,
} from 'react-bootstrap';
import axios from 'axios';
import {
  BsGoogle,
  BsEye,
  BsEyeSlash
} from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Login = ({ theme, setUser }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // 🔁 Se sei già loggato, ti mando subito nella home
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      navigate('/', { replace: true });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const payload = {
        email: formData.email.trim(),
        password: formData.password,
      };

      const res = await axios.post(`${BACKEND_URL}/api/users/login`, payload);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      setUser(res.data.user);

      if (res.data.user.themePreference) {
        document.body.className = `${res.data.user.themePreference}-theme`;
      }

      setMessage('Login effettuato con successo!');

      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    } catch (error) {
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Errore durante il login');
      }
    }

    setLoading(false);
  };

  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/api/users/auth/google`;
  };

  return (
    <Container
      fluid
      className={`py-5 ${
        theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'
      }`}
      style={{ minHeight: '100vh' }}
    >
      <Row className="justify-content-center align-items-center">
        <Col md={6} lg={5}>
          <Card
            className={`shadow-lg p-4 ${
              theme === 'dark' ? 'bg-secondary text-light' : 'bg-white text-dark'
            }`}
          >
            <h2 className="text-center mb-3">GameVerse</h2>
            <p className="text-center mb-4">Bentornato su GameVerse</p>

            {message && (
              <div
                className={`alert ${
                  message.toLowerCase().includes('errore')
                    ? 'alert-danger'
                    : 'alert-success'
                }`}
              >
                {message}
              </div>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Inserisci la tua email"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Inserisci la password"
                    required
                  />
                  <Button
                    variant={theme === 'dark' ? 'secondary' : 'outline-secondary'}
                    onClick={toggleShowPassword}
                    type="button"
                    tabIndex={-1}
                    aria-label={
                      showPassword ? 'Nascondi password' : 'Mostra password'
                    }
                  >
                    {showPassword ? <BsEyeSlash /> : <BsEye />}
                  </Button>
                </InputGroup>
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-100 mb-3"
              >
                {loading ? 'Login in corso...' : 'Accedi'}
              </Button>
            </Form>

            <hr />

            <Button
              variant="danger"
              className="w-100 d-flex align-items-center justify-content-center"
              onClick={handleGoogleLogin}
              aria-label="Accedi con Google"
            >
              <BsGoogle size={20} className="me-2" />
              Accedi con Google
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
