import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { BsGoogle, BsEye, BsEyeSlash } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = 'http://localhost:5000';

const Register = ({ theme, setUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    username: '',
    password: '',
    birthDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Formatta la data in dd/mm/yyyy
    const isoDate = formData.birthDate;
    const [year, month, day] = isoDate.split('-');
    const formattedDate = `${day}/${month}/${year}`;

    const dataToSend = {
      ...formData,
      birthDate: formattedDate,
    };

    try {
      // Registrazione
      await axios.post(`${BACKEND_URL}/api/users/register`, dataToSend);

      setMessage('Registrazione completata! Effettuo il login...');

      // Login automatico dopo registrazione
      const loginRes = await axios.post(`${BACKEND_URL}/api/users/login`, {
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem('token', loginRes.data.token);
      localStorage.setItem('user', JSON.stringify(loginRes.data.user));

      setUser(loginRes.data.user);  // Aggiorna stato globale utente

      setTimeout(() => {
        navigate('/');
      }, 1000);

    } catch (error) {
      console.error('Errore registrazione:', error);
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else if (error.message) {
        setMessage(error.message);
      } else {
        setMessage('Errore durante la registrazione.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = `${BACKEND_URL}/api/users/auth/google`;
  };

  return (
    <Container
      fluid
      className={`py-5 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}
      style={{ minHeight: '100vh' }}
    >
      <Row className="justify-content-center align-items-center">
        <Col md={6} lg={5}>
          <Card
            className={`shadow-lg p-4 ${theme === 'dark' ? 'bg-secondary text-light' : 'bg-white text-dark'}`}
          >
            <h2 className="text-center mb-3">GameVerse</h2>
            <p className="text-center mb-4">Unisciti a noi diventando uno UserVerse</p>

            {message && (
              <div className={`alert ${message.toLowerCase().includes('errore') ? 'alert-danger' : 'alert-success'}`}>
                {message}
              </div>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoComplete="given-name"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="surname">
                <Form.Label>Cognome</Form.Label>
                <Form.Control
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  required
                  autoComplete="family-name"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  autoComplete="username"
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
                    required
                    placeholder="Inserisci la password"
                    autoComplete="new-password"
                  />
                  <Button
                    variant={theme === 'dark' ? 'secondary' : 'outline-secondary'}
                    onClick={toggleShowPassword}
                    type="button"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
                  >
                    {showPassword ? <BsEyeSlash /> : <BsEye />}
                  </Button>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3" controlId="birthDate">
                <Form.Label>Data di nascita</Form.Label>
                <Form.Control
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                  autoComplete="bday"
                />
              </Form.Group>

              <Button type="submit" variant="primary" disabled={loading} className="w-100 mb-3">
                {loading ? 'Registrazione in corso...' : 'Registrati'}
              </Button>
            </Form>

            <hr />

            <Button
              variant="danger"
              className="w-100 d-flex align-items-center justify-content-center"
              onClick={handleGoogleRegister}
              aria-label="Registrati con Google"
            >
              <BsGoogle size={20} className="me-2" />
              Registrati con Google
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
