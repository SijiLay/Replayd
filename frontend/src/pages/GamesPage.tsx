import { useEffect, useState } from "react"
import type { Game } from "../types/Game"
import { getGames } from "../services/gameService"
import GameCard from "../components/GameCard"
import "./GamePage.css"

function GamesPage() {
    const [games, setGames] = useState<Game[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [search, setSearch] = useState("")

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
    const filteredGames = games.filter((game) => {
        const matchup = `${game.awayTeam} ${game.homeTeam}`.toLowerCase()

        return matchup.includes(search.toLowerCase())
    })
    return (
        <main>
            <div className="games-page-header">
                <input
                    type="text"
                    placeholder="Search teams..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="game-search"
                />
                <h1>Games</h1>
                <p>Find a game you've watched and add it to your Replayd history.</p>
            </div>

            <div className="games-list">
                {filteredGames.length === 0 && (
                    <p>No games found.</p>
                )}
                {filteredGames.map((game) => (
                    <GameCard key={game.id} game={game} />
                ))}
            </div>
        </main>
    )
}

export default GamesPage