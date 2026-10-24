import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import type { GameLog } from "../types/GameLog"
import { getGameLogById } from "../services/gameLogService"
import "./HistoryDetailPage.css"
import StarRating from "../components/StarRating"
import { Link } from "react-router-dom"

function HistoryDetailPage() {
    const { id } = useParams()

    const [gameLog, setGameLog] = useState<GameLog | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadGameLog() {
            try {
                if (!id) {
                    setError("Game log not found")
                    return
                }

                const data = await getGameLogById(Number(id))
                setGameLog(data)
            } catch {
                setError("Could not load game log")
            } finally {
                setLoading(false)
            }
        }

        loadGameLog()
    }, [id])

    if (loading) {
        return <p>Loading game log...</p>
    }

    if (error || !gameLog) {
        return <p>{error ?? "Game log not found"}</p>
    }

    return (
        <main className="history-detail">
            <section className="history-detail-card">
                <h1>
                    {gameLog.game.awayTeam} at {gameLog.game.homeTeam}
                </h1>

                <p className="history-detail-meta">
                    {gameLog.game.sport} • Week {gameLog.game.week} •{" "}
                    {gameLog.game.season}
                </p>

                <p className="history-detail-meta">
                    Watch Type:{" "}
                    {gameLog.watchType === "FULL_GAME"
                        ? "Full Game"
                        : "Highlights"}
                </p>

                {gameLog.rating !== null ? (
                    <StarRating
                        value={gameLog.rating}
                        readOnly
                    />
                ) : (
                    <p className="history-detail-meta">No rating</p>
                )}

                <div className="history-detail-review">
                    {gameLog.reviewText ?? "No review"}
                </div>

                <p className="history-detail-logged">
                    Logged: {new Date(gameLog.loggedAt).toLocaleString()}
                </p>
                <Link
                    to={`/games/${gameLog.game.id}`}
                    className="edit-replayd-link"
                >
                    Edit Replayd
                </Link>
            </section>
        </main>
    )
}

export default HistoryDetailPage