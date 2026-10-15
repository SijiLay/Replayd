import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import GamesPage from "./pages/GamesPage"
import GameDetailPage from "./pages/GameDetailPage"
import HistoryPage from "./pages/HistoryPage"
import HistoryDetailPage from "./pages/HistoryDetailPage"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/games" replace />} />
                <Route path="/games" element={<GamesPage />} />
                <Route path="/games/:id" element={<GameDetailPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/history/:id" element={<HistoryDetailPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App

//handles things like routing and decides which page component should render