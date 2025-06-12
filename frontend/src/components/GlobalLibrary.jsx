import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 12;

const GlobalLibrary = ({ theme, user, searchTerm }) => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [savingIds, setSavingIds] = useState(new Set());

  // Funzione fetch senza dipendenze variabili
  const fetchGamesPage = useCallback(async (pageNum) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/games?page=${pageNum}&limit=${PAGE_SIZE}`);
      if (!res.ok) throw new Error('Errore caricamento giochi');
      const data = await res.json();
      const gamesData = Array.isArray(data) ? data : (data.games ?? []);
      setGames(prev => pageNum === 1 ? gamesData : [...prev, ...gamesData]);
      setHasMore(gamesData.length === PAGE_SIZE);
    } catch (error) {
      console.error(error);
      setGames([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Funzione fetch per ricerca (senza pagina)
  const fetchGamesSearch = useCallback(async (query) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/games/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Errore caricamento giochi');
      const data = await res.json();
      const gamesData = Array.isArray(data) ? data : (data.games ?? []);
      setGames(gamesData);
      setHasMore(false);
    } catch (error) {
      console.error(error);
      setGames([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effetto per paginazione - attivo solo se non c'è ricerca
  useEffect(() => {
    if (!searchTerm || searchTerm.trim().length === 0) {
      fetchGamesPage(page);
    }
  }, [page, searchTerm, fetchGamesPage]);

  // Effetto per ricerca - attivo solo se c'è ricerca
  useEffect(() => {
    if (searchTerm && searchTerm.trim().length > 0) {
      fetchGamesSearch(searchTerm.trim());
      setPage(1); // reset pagina per sicurezza
    }
  }, [searchTerm, fetchGamesSearch]);

  // Scroll infinito solo se non c'è ricerca attiva
  useEffect(() => {
    if (searchTerm && searchTerm.trim().length > 0) return;

    const handleScroll = () => {
      if (loading || !hasMore) return;
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
        setPage(prev => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, searchTerm]);

  // Salvataggio gioco (stessa logica)
  const handleSaveGame = async (gameId) => {
    if (!user) {
      alert('Devi essere loggato per salvare giochi.');
      return;
    }
    if (savingIds.has(gameId)) return;

    setSavingIds(prev => new Set(prev).add(gameId));
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token mancante');
      const res = await fetch(`/api/users/library/${gameId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Errore nel salvataggio');
      alert('Gioco salvato nella tua libreria!');
    } catch (error) {
      console.error(error);
      alert('Errore durante il salvataggio del gioco.');
    } finally {
      setSavingIds(prev => {
        const copy = new Set(prev);
        copy.delete(gameId);
        return copy;
      });
    }
  };

  return (
    <Container
      fluid
      className={theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}
      style={{ minHeight: 'calc(100vh - 120px)', paddingTop: '1rem' }}
    >
      <h3
        className="mb-4"
        style={{ fontWeight: '700', color: theme === 'dark' ? '#61dafb' : '#007bff' }}
      >
        Libreria globale di GameVerse
      </h3>

      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {games.length > 0 ? (
          games.map(game => (
            <Col key={game._id}>
              <Card
                className={`h-100 ${theme === 'dark' ? 'bg-secondary text-light' : 'bg-white text-dark'}`}
                style={{
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Card.Img
                  variant="top"
                  src={game.coverImage || 'https://via.placeholder.com/300x180?text=No+Image'}
                  alt={`${game.title} cover`}
                  style={{ height: '180px', objectFit: 'cover' }}
                  onClick={() => navigate(`/games/${game._id}`)}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="mb-3">{game.title}</Card.Title>
                  <Button
                    variant={theme === 'dark' ? 'outline-light' : 'primary'}
                    onClick={() => handleSaveGame(game._id)}
                    disabled={savingIds.has(game._id)}
                    className="mb-2"
                  >
                    {savingIds.has(game._id) ? 'Salvando...' : 'Salva in libreria'}
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'outline-light' : 'secondary'}
                    onClick={() => navigate(`/games/${game._id}`)}
                  >
                    Dettagli
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          !loading && <p className="text-center w-100">Nessun gioco disponibile.</p>
        )}
      </Row>

      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" variant={theme === 'dark' ? 'light' : 'dark'} />
        </div>
      )}
    </Container>
  );
};

export default GlobalLibrary;
