import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import type { Game } from "../types/Game"
import { getGameById } from "../services/gameService"

function GameDetailPage() {
    const { id } = useParams()
    const [game, setGame] = useState<Game | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadGame() {
            try {
                if (!id) {
                    setError("Game not found")
                    return
                }

                const data = await getGameById(Number(id))
                setGame(data)
            } catch {
                setError("Could not load game")
            } finally {
                setLoading(false)
            }
        }

        loadGame()
    }, [id])

    if (loading) {
        return <p>Loading game...</p>
    }

    if (error || !game) {
        return <p>{error ?? "Game not found"}</p>
    }

    return (
        <main>
            <h1>
                {game.awayTeam} at {game.homeTeam}
            </h1>

            <p>
                {game.sport} — Week {game.week} — {game.season}
            </p>

            <p>{new Date(game.gameDate).toLocaleString()}</p>
        </main>
    )
}

export default GameDetailPage