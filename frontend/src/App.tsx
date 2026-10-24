import { BrowserRouter, Route, Routes } from "react-router-dom"
import GamesPage from "./pages/GamesPage"
import GameDetailPage from "./pages/GameDetailPage"
import HistoryPage from "./pages/HistoryPage"
import HistoryDetailPage from "./pages/HistoryDetailPage"
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"

function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                <Route path="/" element={<HomePage />} />
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