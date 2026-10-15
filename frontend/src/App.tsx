import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import GamesPage from "./pages/GamesPage"
import GameDetailPage from "./pages/GameDetailPage"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/games" replace />} />
                <Route path="/games" element={<GamesPage />} />
                <Route path="/games/:id" element={<GameDetailPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App

//handles things like routing and decides which page component should render