import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './MyLibrary.css';  // Import CSS esterno

const PAGE_SIZE = 9;

function MyLibrary({ theme, user }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Debounce ref
  const debounceTimeout = useRef(null);

  const fetchGames = useCallback(async (pageNum, query, append = false) => {
    if (!user) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    try {
      const url = new URL('/api/users/library', window.location.origin);
      url.searchParams.append('page', pageNum);
      url.searchParams.append('limit', PAGE_SIZE);
      if (query) url.searchParams.append('q', query);

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Errore caricamento giochi');

      const data = await res.json();

      setGames(prev => append ? [...prev, ...data.games] : data.games);
      setHasMore(data.games.length === PAGE_SIZE);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Carica giochi iniziali e al cambio ricerca con debounce
  useEffect(() => {
    if (!user) return;

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setPage(1);
      fetchGames(1, searchTerm, false);
    }, 500);

    return () => clearTimeout(debounceTimeout.current);
  }, [searchTerm, fetchGames, user]);

  // Infinite scroll handler
  useEffect(() => {
    if (!hasMore || loading) return;

    function handleScroll() {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
        setPage(prev => prev + 1);
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading]);

  // Quando cambia la pagina, carica più giochi (append)
  useEffect(() => {
    if (page === 1) return; // già caricato da useEffect ricerca
    fetchGames(page, searchTerm, true);
  }, [page, searchTerm, fetchGames]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Rimuovi gioco dalla libreria
  const handleRemoveGame = async (gameId) => {
    if (!user) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`/api/users/library/${gameId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Errore durante la rimozione del gioco');

      // Aggiorna lista locale
      setGames(prev => prev.filter(game => game._id !== gameId));
    } catch (error) {
      console.error(error);
      alert('Errore durante la rimozione del gioco dalla libreria.');
    }
  };

  if (!user) {
    return (
      <Container className="text-center my-5">
        <p>Devi essere loggato per vedere la tua libreria.</p>
      </Container>
    );
  }

  return (
    <Container fluid className={`${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`} style={{ minHeight: '100vh', paddingTop: '1rem' }}>
      <h3 className={`library-title mb-4 ${theme === 'dark' ? 'dark' : 'light'}`}>
        Libreria di {user.username}
      </h3>

      <Form className="d-flex justify-content-center mb-4" style={{ maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
        <Form.Control
          type="search"
          placeholder="Cerca un gioco nella tua libreria..."
          value={searchTerm}
          onChange={handleSearchChange}
          autoComplete="off"
          aria-label="Cerca un gioco nella libreria"
        />
        {/* Bottone ricerca rimosso per live search */}
      </Form>

      <Row xs={1} sm={2} md={3} className="g-4">
        {games.map(game => (
          <Col key={game._id}>
            <Card className={`${theme === 'dark' ? 'bg-secondary text-light' : 'bg-white text-dark'}`}>
              <Card.Img
                variant="top"
                src={game.coverImage || 'https://via.placeholder.com/300x180?text=No+Image'}
                alt={`${game.title} cover`}
                style={{ objectFit: 'cover', height: '180px' }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{game.title}</Card.Title>
                <div className="mt-auto d-flex justify-content-between">
                  <Button
                    variant={theme === 'dark' ? 'outline-light' : 'primary'}
                    onClick={() => navigate(`/games/${game._id}`)}
                  >
                    Dettagli
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveGame(game._id)}
                  >
                    Rimuovi
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" variant={theme === 'dark' ? 'light' : 'dark'} />
        </div>
      )}
    </Container>
  );
}

export default MyLibrary;
