import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import type { GameLog } from "../types/GameLog"
import { getGameLogById } from "../services/gameLogService"

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
        <main>
            <h1>
                {gameLog.game.awayTeam} at {gameLog.game.homeTeam}
            </h1>

            <p>
                {gameLog.game.sport} — Week {gameLog.game.week} —{" "}
                {gameLog.game.season}
            </p>

            <p>
                Rating:{" "}
                {gameLog.rating !== null ? `${gameLog.rating}/5` : "No rating"}
            </p>

            <p>{gameLog.reviewText ?? "No review"}</p>

            <p>
                Logged: {new Date(gameLog.loggedAt).toLocaleString()}
            </p>
        </main>
    )
}

export default HistoryDetailPage