import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { BsTrash } from 'react-icons/bs';

const PAGE_SIZE = 12;

const GlobalLibrary = ({ theme, user, searchTerm }) => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [savingIds, setSavingIds] = useState(new Set());

  const fetchGames = useCallback(async (pageNum, query = '') => {
    setLoading(true);
    try {
      let url = query
        ? `/api/games/search?q=${encodeURIComponent(query.trim())}`
        : `/api/games?page=${pageNum}&limit=${PAGE_SIZE}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('Errore caricamento giochi');
      const data = await res.json();

      const newGames = Array.isArray(data)
        ? data
        : Array.isArray(data.games) ? data.games : [];

      const total = typeof data.total === 'number'
        ? data.total
        : newGames.length;

      if (pageNum === 1 || query) {
        setGames(newGames);
      } else {
        setGames(prev => [...prev, ...newGames]);
      }

      setHasMore(newGames.length === PAGE_SIZE && total > pageNum * PAGE_SIZE);
    } catch (error) {
      console.error('Errore fetchGames:', error);
      setGames([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchGames(1, searchTerm);
  }, [searchTerm, fetchGames]);

  useEffect(() => {
    fetchGames(page, searchTerm);
  }, [page, searchTerm, fetchGames]);

  const handleSaveGame = async (gameId) => {
    if (!user) return alert('Devi essere loggato per salvare giochi.');
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

  const handleDeleteGame = async (gameId) => {
    const confirmDelete = window.confirm('Sei sicuro di voler eliminare questo gioco?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token mancante');

      const res = await fetch(`/api/games/${gameId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Errore nella cancellazione');
      alert('Gioco eliminato con successo!');
      setGames(prev => prev.filter(g => g._id !== gameId));
    } catch (error) {
      console.error('Errore eliminazione gioco:', error);
      alert('Errore durante l\'eliminazione del gioco.');
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
        {games.map(game => (
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
                src={
                  game.coverImage
                    ? game.coverImage.startsWith('/assets/')
                      ? game.coverImage
                      : `/assets/games/${game.coverImage}`
                    : 'https://via.placeholder.com/300x180?text=No+Image'
                }
                alt={`${game.title} cover`}
                style={{ height: '180px', width: '100%', objectFit: 'cover' }}
                onClick={() => navigate(`/games/${game._id}`)}
                onError={(e) => {
                  console.warn(`[ERROR] Immagine non trovata per ${game.title}: ${game.coverImage}`);
                  e.currentTarget.src = 'https://via.placeholder.com/300x180?text=No+Image';
                }}
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
                  className="mb-2"
                >
                  Dettagli
                </Button>

                {user?.isAdmin && (
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteGame(game._id)}
                    className="d-flex align-items-center justify-content-center gap-2"
                  >
                    <BsTrash />
                    Elimina gioco
                  </Button>
                )}
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

      {!searchTerm && (
        <div className="d-flex justify-content-center align-items-center gap-3 my-4">
          <Button
            variant={theme === 'dark' ? 'outline-light' : 'outline-primary'}
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1 || loading}
            size="lg"
          >
            ◀ Indietro
          </Button>

          <span className="fw-bold fs-5">Pagina {page}</span>

          <Button
            variant={theme === 'dark' ? 'outline-light' : 'primary'}
            onClick={() => setPage(prev => prev + 1)}
            disabled={!hasMore || loading}
            size="lg"
          >
            Avanti ▶
          </Button>
        </div>
      )}
    </Container>
  );
};

export default GlobalLibrary;
