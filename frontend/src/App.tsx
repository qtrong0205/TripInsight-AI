import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FavoritesProvider } from './contexts/favorites/FavoritesProvider';
import { AuthProvider } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppShell from './components/AppShell';
import Home from './pages/Home';
import DestinationDetails from './pages/DestinationDetails';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import EditProfile from './pages/UpdateProfile';
import SignupFailed from './pages/SignUpFailed';

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <AuthProvider>
                    <FavoritesProvider>
                        <AppShell>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/destination/:slug" element={<DestinationDetails />} />
                                <Route path="/favorites" element={<Favorites />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/signup-status" element={<SignupFailed />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/edit-profile" element={<EditProfile />} />
                            </Routes>
                        </AppShell>
                    </FavoritesProvider>
                </AuthProvider>
            </Router>
        </QueryClientProvider>
    );
}

export default App;
