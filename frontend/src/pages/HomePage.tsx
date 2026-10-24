import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import type { GameLog } from "../types/GameLog"
import { getGameLogs } from "../services/gameLogService"
import StarRating from "../components/StarRating"
import "./HomePage.css"

function HomePage() {
    const [recentLogs, setRecentLogs] = useState<GameLog[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadRecentLogs() {
            try {
                const data = await getGameLogs()

                const recent = [...data]
                    .sort(
                        (a, b) =>
                            new Date(b.loggedAt).getTime() -
                            new Date(a.loggedAt).getTime()
                    )
                    .slice(0, 3)

                setRecentLogs(recent)
            } finally {
                setLoading(false)
            }
        }

        loadRecentLogs()
    }, [])

    return (
        <main className="home-page">
            <section className="home-hero">
                <h1>Replayd</h1>
                <p>Track, rate, and review the games you watch.</p>

                <Link to="/games" className="home-primary-link">
                    Browse Games
                </Link>
            </section>

            <section className="recent-section">
                <div className="section-header">
                    <h2>Recently Replayd</h2>

                    <Link to="/history">
                        View History
                    </Link>
                </div>

                {loading && <p>Loading recent games...</p>}

                {!loading && recentLogs.length === 0 && (
                    <p>No games Replayd yet.</p>
                )}

                <div className="recent-grid">
                    {recentLogs.map((gameLog) => (
                        <Link
                            key={gameLog.id}
                            to={`/history/${gameLog.id}`}
                            className="recent-card"
                        >
                            <h3>
                                {gameLog.game.awayTeam} at{" "}
                                {gameLog.game.homeTeam}
                            </h3>

                            <p>
                                {gameLog.watchType === "FULL_GAME"
                                    ? "Full Game"
                                    : "Highlights"}
                            </p>

                            {gameLog.rating !== null && (
                                <StarRating
                                    value={gameLog.rating}
                                    readOnly
                                />
                            )}
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    )
}

export default HomePage