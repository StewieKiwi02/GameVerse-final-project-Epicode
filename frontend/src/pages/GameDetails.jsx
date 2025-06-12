import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Image,
  Table,
  Form,
  Button,
  Card,
  Spinner,
} from 'react-bootstrap';
import { BsYoutube } from 'react-icons/bs';
import { useParams, useNavigate } from 'react-router-dom';

function GameDetails({ theme, user }) {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [commentRating, setCommentRating] = useState(5);
  const [loadingGame, setLoadingGame] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [postingComment, setPostingComment] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);

  // Fetch game details
  useEffect(() => {
    async function fetchGame() {
      setLoadingGame(true);
      try {
        const res = await fetch(`/api/games/${gameId}`);
        if (!res.ok) throw new Error('Errore caricamento gioco');
        const data = await res.json();
        setGame(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingGame(false);
      }
    }
    fetchGame();
  }, [gameId]);

  // Fetch comments paginati
  useEffect(() => {
    async function fetchComments() {
      if (!hasMoreComments) return;
      setLoadingComments(true);
      try {
        const res = await fetch(
          `/api/comments/game/${gameId}?page=${page}&limit=5`
        );
        if (!res.ok) throw new Error('Errore caricamento commenti');
        const data = await res.json();

        setComments((prev) => (page === 1 ? data : [...prev, ...data]));
        setHasMoreComments(data.length === 5);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingComments(false);
      }
    }
    fetchComments();
  }, [gameId, page]); // tolto hasMoreComments da dipendenze per evitare loop

  // Infinite scroll per i commenti
  useEffect(() => {
    function handleScroll() {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 300 &&
        !loadingComments &&
        hasMoreComments
      ) {
        setPage((prev) => prev + 1);
      }
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingComments, hasMoreComments]);

  // Calcola rating medio
  const averageRating =
    comments.length > 0
      ? comments.reduce((acc, c) => acc + c.rating, 0) / comments.length
      : 0;

  // Render stelle rating
  const renderStars = (rating) => {
    const fullStars = Math.round(rating);
    return [...Array(5)].map((_, i) => (
      <span key={i} style={{ color: '#ffc107', fontSize: '1.2rem' }}>
        {i < fullStars ? '★' : '☆'}
      </span>
    ));
  };

  // Submit commento
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Devi essere loggato per commentare.');
      return;
    }
    if (!commentContent.trim()) {
      alert('Inserisci un commento.');
      return;
    }
    if (commentRating < 1 || commentRating > 5) {
      alert('La valutazione deve essere tra 1 e 5.');
      return;
    }

    setPostingComment(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          relatedTo: gameId,
          content: commentContent,
          rating: commentRating,
        }),
      });
      if (!res.ok) throw new Error('Errore invio commento');
      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]);
      setCommentContent('');
      setCommentRating(5);
    } catch (error) {
      console.error(error);
      alert('Errore durante la pubblicazione del commento.');
    } finally {
      setPostingComment(false);
    }
  };

  // Elimina commento (solo admin)
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo commento?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Errore eliminazione commento');
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (error) {
      console.error(error);
      alert('Errore durante l\'eliminazione del commento.');
    }
  };

  if (loadingGame) {
    return (
      <Container
        fluid
        className={`${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'} d-flex justify-content-center align-items-center`}
        style={{ minHeight: '80vh' }}
      >
        <Spinner animation="border" variant={theme === 'dark' ? 'light' : 'dark'} />
      </Container>
    );
  }

  if (!game) {
    return (
      <Container className="text-center my-5">
        <p>Gioco non trovato.</p>
      </Container>
    );
  }

  return (
    <Container fluid className={`${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`} style={{ minHeight: '100vh', paddingTop: '1rem' }}>
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Image 
            src={game.coverImage || '/assets/games/placeholder.jpg'} 
            alt={`${game.title} cover`} 
            fluid 
            rounded 
          />
          {game.trailerUrl && (
            <a
              href={game.trailerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`d-block mt-2 ${theme === 'dark' ? 'text-info' : 'text-primary'}`}
              aria-label="Guarda il trailer su YouTube"
            >
              <BsYoutube size={24} /> Guarda il trailer
            </a>
          )}
        </Col>

        <Col md={6}>
          <h2>{game.title}</h2>
          <p>{game.description}</p>
          <p><strong>Produttore:</strong> {game.producer}</p>
          <p><strong>Data di rilascio:</strong> {new Date(game.releaseDate).toLocaleDateString('it-IT')}</p>
          <p><strong>Categoria:</strong> {game.category.map(cat => cat.category).join(', ')}</p>
          <p><strong>Piattaforme:</strong> {game.platforms.map(p => p.platform).join(', ')}</p>
          <p><strong>Genere:</strong> {game.genre.map(g => g.genre).join(', ')}</p>

          <Table bordered responsive className="mt-3">
            <thead>
              <tr>
                <th>Lingua Interfaccia</th>
                <th>Lingua Audio</th>
                <th>Sottotitoli</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{game.languages.interface.map(l => l.name).join(', ')}</td>
                <td>{game.languages.audio.map(l => l.name).join(', ')}</td>
                <td>{game.languages.subtitles.map(l => l.name).join(', ')}</td>
              </tr>
            </tbody>
          </Table>

          <p>
            <strong>Giocabilità:</strong> {game.playMode.charAt(0).toUpperCase() + game.playMode.slice(1).replace('-', ' ')}
          </p>
          <p>
            <strong>Valutazione media: </strong> {renderStars(averageRating)} ({averageRating.toFixed(1)})
          </p>
          <p><strong>PEGI:</strong> {game.pegi}</p>
        </Col>

        <Col md={3}>
          {user ? (
            <Form onSubmit={handleCommentSubmit}>
              <Form.Group controlId="commentContent" className="mb-3">
                <Form.Label>Scrivi un commento</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  maxLength={2000}
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Inserisci il tuo commento qui..."
                  required
                  disabled={postingComment}
                />
              </Form.Group>

              <Form.Group controlId="commentRating" className="mb-3">
                <Form.Label>Valutazione personale</Form.Label>
                <Form.Select
                  value={commentRating}
                  onChange={(e) => setCommentRating(Number(e.target.value))}
                  required
                  aria-label="Seleziona una valutazione da 1 a 5"
                  disabled={postingComment}
                >
                  {[5,4,3,2,1].map((val) => (
                    <option key={val} value={val}>{val} stelle</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Button type="submit" disabled={postingComment || !commentContent.trim()} className="w-100">
                {postingComment ? 'Pubblicazione...' : 'Pubblica Commento'}
              </Button>
            </Form>
          ) : (
            <p>Devi essere loggato per commentare.</p>
          )}
        </Col>
      </Row>

      <div
        className={`pt-4 mt-4 border-top ${theme === 'dark' ? 'border-light' : 'border-dark'}`}
        style={{ backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f8f9fa' }}
      >
        <h4 className="text-center mb-4">Sezione Commenti</h4>
        <Row xs={1} md={2} lg={3} className="g-3">
          {comments.map((comment) => (
            <Col key={comment._id}>
              <Card
                bg={theme === 'dark' ? 'secondary' : 'light'}
                text={theme === 'dark' ? 'light' : 'dark'}
                className="h-100"
              >
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <span>{comment.author?.username || 'Utente'}</span>
                  {user?.isAdmin && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteComment(comment._id)}
                      aria-label={`Elimina commento di ${comment.author?.username}`}
                    >
                      Elimina
                    </Button>
                  )}
                </Card.Header>
                <Card.Body>
                  <Card.Text>{comment.content}</Card.Text>
                  <div>{renderStars(comment.rating)}</div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        {loadingComments && (
          <div className="text-center my-4">
            <Spinner animation="border" variant={theme === 'dark' ? 'light' : 'dark'} />
          </div>
        )}
        {!hasMoreComments && comments.length > 0 && (
          <p className="text-center my-3">Nessun altro commento.</p>
        )}
      </div>
    </Container>
  );
}

export default GameDetails;
