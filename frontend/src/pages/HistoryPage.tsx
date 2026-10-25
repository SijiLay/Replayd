import { useEffect, useState } from "react"
import type { GameLog } from "../types/GameLog"
import { getGameLogs } from "../services/gameLogService"
import { Link } from "react-router-dom"
import "./HistoryPage.css"
import StarRating from "../components/StarRating"

function HistoryPage() {
    const [gameLogs, setGameLogs] = useState<GameLog[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadGameLogs() {
            try {
                const data = await getGameLogs()
                setGameLogs(data)
            } catch {
                setError("Could not load Replayd history")
            } finally {
                setLoading(false)
            }
        }

        loadGameLogs()
    }, [])

    if (loading) {
        return <p>Loading history...</p>
    }

    if (error) {
        return <p>{error}</p>
    }

    return (
        <main>
            <div className="history-page-header">
                <h1>Replayd History</h1>

                <p>
                    Your watched games, ratings, and reviews.
                </p>
            </div>

            {gameLogs.length === 0 && (
                <p>No games Replayd yet.</p>
            )}

            <div className="history-list">

                {gameLogs.map((gameLog) => (

                    <Link
                        to={`/history/${gameLog.id}`}
                        className="history-card"
                        key={gameLog.id}
                    >

                        <div className="history-card-top">

                            <div className="history-card-team">

                                {gameLog.game.awayTeamBadge && (
                                    <img
                                        src={gameLog.game.awayTeamBadge}
                                        alt={`${gameLog.game.awayTeam} logo`}
                                        className="history-card-logo"
                                    />
                                )}

                                <span>
                                    {gameLog.game.awayTeam}
                                </span>

                            </div>


                            <div className="history-card-team">

                                {gameLog.game.homeTeamBadge && (
                                    <img
                                        src={gameLog.game.homeTeamBadge}
                                        alt={`${gameLog.game.homeTeam} logo`}
                                        className="history-card-logo"
                                    />
                                )}

                                <span>
                                    {gameLog.game.homeTeam}
                                </span>

                            </div>

                        </div>


                        <p className="history-meta">
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

                            <p className="history-meta">
                                No rating
                            </p>

                        )}


                        <p className="history-review">

                            {gameLog.reviewText
                                ? gameLog.reviewText.length > 120
                                    ? `${gameLog.reviewText.slice(0, 120)}...`
                                    : gameLog.reviewText
                                : "No review"}

                        </p>

                    </Link>

                ))}

            </div>

        </main>
    )
}

export default HistoryPage