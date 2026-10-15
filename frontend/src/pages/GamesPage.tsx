import { useEffect, useState } from "react"
import type { Game } from "../types/Game"
import { getGames } from "../services/gameService"
import GameCard from "../components/GameCard"

function GamesPage() {
    const [games, setGames] = useState<Game[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadGames() {
            try {
                const data = await getGames()
                setGames(data)
            } catch {
                setError("Could not load games")
            } finally {
                setLoading(false)
            }
        }

        loadGames()
    }, [])

    if (loading) {
        return <p>Loading games...</p>
    }

    if (error) {
        return <p>{error}</p>
    }

    return (
        <main>
            <h1>Games</h1>

            {games.map((game) => (
                <GameCard key={game.id} game={game} />
            ))}
        </main>
    )
}

export default GamesPage