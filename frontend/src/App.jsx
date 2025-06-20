import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Outlet, Routes, Route, Navigate } from 'react-router-dom';
import TitleBanner from './components/TitleBanner';
import NavbarComponent from './components/NavbarComponent';
import Footer from './components/Footer';
import Register from './pages/Register';
import Login from './pages/Login';
import ProfilePage from './pages/ProfilePage';
import LoginSuccess from './pages/LoginSuccess';
import Contatti from './pages/Contatti';
import Privacy from './pages/Privacy';
import Termini from './pages/Termini';
import AddGamePage from './pages/AddGamePage';
import MyLibrary from './pages/MyLibrary';
import GameDetails from './pages/GameDetails';
import GlobalLibrary from './components/GlobalLibrary';

const BANNER_HEIGHT = 60;
const NAVBAR_HEIGHT = 60;

const PrivateRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/login" replace />;
};

function HomeLayout({ theme, user, setTheme, setUser, searchTerm, setSearchTerm }) {
  return (
    <div
      className={`main-layout ${theme}-theme`}
      style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <header
        className="fixed-top d-flex align-items-center"
        style={{ height: BANNER_HEIGHT, zIndex: 1060, width: '100%', padding: '0 1rem' }}
      >
        <TitleBanner username={user?.username} />
      </header>

      <NavbarComponent
        theme={theme}
        setTheme={setTheme}
        user={user}
        setUser={setUser}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <main
        style={{
          marginTop: BANNER_HEIGHT + NAVBAR_HEIGHT,
          flex: 1,
          overflowY: 'auto',
          width: '100%',
          padding: '1rem',
          marginBottom: 0,
        }}
      >
        <Outlet />
      </main>

      <Footer theme={theme} />
    </div>
  );
}

function PlainLayout() {
  return (
    <main style={{ padding: '1rem' }}>
      <Outlet />
    </main>
  );
}

function AppRoutes({ theme, user, setUser, setTheme, searchTerm, setSearchTerm }) {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomeLayout
            theme={theme}
            user={user}
            setTheme={setTheme}
            setUser={setUser}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        }
      >
        <Route index element={<GlobalLibrary theme={theme} user={user} searchTerm={searchTerm} />} />
      </Route>

      <Route path="/" element={<PlainLayout />}>
        <Route
          path="games/:gameId"
          element={
            <PrivateRoute user={user}>
              <GameDetails theme={theme} user={user} />
            </PrivateRoute>
          }
        />
        <Route
          path="profile"
          element={
            <PrivateRoute user={user}>
              <ProfilePage theme={theme} />
            </PrivateRoute>
          }
        />
        <Route
          path="aggiungi-gioco"
          element={
            <PrivateRoute user={user}>
              <AddGamePage theme={theme} />
            </PrivateRoute>
          }
        />
        <Route
          path="my-library"
          element={
            <PrivateRoute user={user}>
              <MyLibrary theme={theme} user={user} />
            </PrivateRoute>
          }
        />
        <Route path="contatti" element={<Contatti theme={theme} />} />
        <Route path="privacy" element={<Privacy theme={theme} />} />
        <Route path="termini" element={<Termini theme={theme} />} />
      </Route>

      <Route path="register" element={<Register theme={theme} setUser={setUser} />} />
      <Route path="login" element={<Login theme={theme} setUser={setUser} />} />
      <Route path="login-success" element={<LoginSuccess theme={theme} setUser={setUser} />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = `${theme}-theme`;
  }, [theme]);

  useEffect(() => {
    let isMounted = true;

    const restoreUserFromLocalStorage = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    const fetchUserFromToken = async (token) => {
      try {
        const res = await fetch('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Token non valido');
        const userData = await res.json();
        if (isMounted) {
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
          if (userData.themePreference) {
            setTheme(userData.themePreference);
          }
        }
      } catch (error) {
        console.error('Errore nel recupero utente:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (isMounted) setUser(null);
      }
    };

    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get('token');
    const localToken = localStorage.getItem('token');

    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl);
      fetchUserFromToken(tokenFromUrl).then(() => {
        navigate(location.pathname, { replace: true });
      });
    } else if (localToken && localToken !== "undefined" && localToken !== "null") {
      restoreUserFromLocalStorage();
      fetchUserFromToken(localToken);
    } else {
      setUser(null);
    }

    return () => {
      isMounted = false;
    };
  }, [location, navigate]);

  return (
    <AppRoutes
      theme={theme}
      user={user}
      setUser={setUser}
      setTheme={setTheme}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    />
  );
}

export default App;
