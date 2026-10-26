import { BrowserRouter, Route, Routes } from "react-router-dom"

import GamesPage from "./pages/GamesPage"
import GameDetailPage from "./pages/GameDetailPage"
import HistoryPage from "./pages/HistoryPage"
import HistoryDetailPage from "./pages/HistoryDetailPage"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import AdminPage from "./pages/AdminPage"

import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./components/AdminRoute"

function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminPage />
                        </AdminRoute>
                    }
                />

                <Route path="/" element={<HomePage />} />

                <Route path="/games" element={<GamesPage />} />

                <Route
                    path="/games/:id"
                    element={<GameDetailPage />}
                />

                <Route
                    path="/history"
                    element={
                        <ProtectedRoute>
                            <HistoryPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/history/:id"
                    element={
                        <ProtectedRoute>
                            <HistoryDetailPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/signup"
                    element={<SignupPage />}
                />
            </Routes>
        </BrowserRouter>
    )
}

export default App

// Handles routing and decides which page component should render