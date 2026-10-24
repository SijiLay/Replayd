import { useEffect, useState } from "react"
import type { GameLog } from "../types/GameLog"
import { getGameLogs } from "../services/gameLogService"
import { Link } from "react-router-dom"

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
            <h1>Replayd History</h1>

            {gameLogs.length === 0 && <p>No games Replayd yet.</p>}

            {gameLogs.map((gameLog) => ( //for every game log create one article
                <article key={gameLog.id}>
                    <Link to={`/history/${gameLog.id}`}>
                        <h2>
                            {gameLog.game.awayTeam} at {gameLog.game.homeTeam}
                        </h2>
                    </Link>
                    <p>
                        Watch Type:{" "}
                        {gameLog.watchType === "FULL_GAME" ? "Full Game" : "Highlights"}
                    </p>
                    <p>
                        Rating: {gameLog.rating !== null ? `${gameLog.rating}/5` : "No rating"}
                    </p>

                    <p>
                        {gameLog.reviewText ?? "No review"}
                    </p>
                </article>
            ))}
        </main>
    )
}

export default HistoryPage