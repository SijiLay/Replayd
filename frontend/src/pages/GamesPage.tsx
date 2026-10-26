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
    const [selectedWeek, setSelectedWeek] = useState(1)

    useEffect(() => {
        async function loadGames() {
            try {
                const data = await getGames()
                setGames(data)
                const now = new Date()

                const relevantGames = data
                    .filter(
                        (game) =>
                            isLiveGame(game) ||
                            new Date(game.gameDate) >= now
                    )
                    .sort(
                        (a, b) =>
                            new Date(a.gameDate).getTime() -
                            new Date(b.gameDate).getTime()
                    )
                    .sort(
                        (a, b) =>
                            new Date(a.gameDate).getTime() -
                            new Date(b.gameDate).getTime()
                    )

                if (relevantGames.length > 0) {
                    setSelectedWeek(relevantGames[0].week)
                } else if (data.length > 0) {
                    const latestGame = [...data].sort(
                        (a, b) =>
                            new Date(b.gameDate).getTime() -
                            new Date(a.gameDate).getTime()
                    )[0]

                    setSelectedWeek(latestGame.week)
                }
            } catch {
                setError("Could not load games")
            } finally {
                setLoading(false)
            }
        }

        loadGames()

        const refreshInterval = setInterval(async () => {
            try {
                const data = await getGames()
                setGames(data)
            } catch {
                console.error("Could not refresh games")
            }
        }, 60000)

        return () => {
            clearInterval(refreshInterval)
        }

    }, [])

    if (loading) {
        return <p>Loading games...</p>
    }

    if (error) {
        return <p>{error}</p>
    }

    const filteredGames = games
        .filter((game) => {
            const matchup = `${game.awayTeam} ${game.homeTeam}`.toLowerCase()

            const matchesSearch =
                matchup.includes(search.toLowerCase())

            const matchesWeek =
                game.week === selectedWeek

            return matchesSearch && matchesWeek
        })
        .sort((a, b) => {
            const aPriority = getGamePriority(a)
            const bPriority = getGamePriority(b)

            if (aPriority !== bPriority) {
                return aPriority - bPriority
            }

            return (
                new Date(a.gameDate).getTime() -
                new Date(b.gameDate).getTime()
            )
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
            <div className="week-navigation">
                <button
                    type="button"
                    onClick={() =>
                        setSelectedWeek((week) => Math.max(1, week - 1))
                    }
                    disabled={selectedWeek === 1}
                >
                    ← Previous
                </button>

                <select
                    value={selectedWeek}
                    onChange={(event) =>
                        setSelectedWeek(Number(event.target.value))
                    }
                >
                    {Array.from({ length: 18 }, (_, index) => index + 1).map((week) => (
                        <option key={week} value={week}>
                            Week {week}
                        </option>
                    ))}
                </select>

                <button
                    type="button"
                    onClick={() =>
                        setSelectedWeek((week) => Math.min(18, week + 1))
                    }
                    disabled={selectedWeek === 18}
                >
                    Next →
                </button>
            </div>
            <div className="games-list">
                {filteredGames.length === 0 && (
                    <p>
                        {search.trim() !== ""
                            ? "No games match your search."
                            : `No games found for Week ${selectedWeek}.`}
                    </p>
                )}
                {filteredGames.map((game) => (
                    <GameCard key={game.id} game={game} />
                ))}
            </div>
        </main>
    )
}
function getGamePriority(game: Game) {
    if (isLiveGame(game)) {
        return 0
    }

    if (!isFinishedGame(game)) {
        return 1
    }

    return 2
}

function isFinishedGame(game: Game) {
    return (
        game.status === "Final" ||
        game.status === "FT" ||
        game.status === "AOT"
    )
}

function isLiveGame(game: Game) {
    return (
        game.status !== null &&
        game.status !== "NS" &&
        !isFinishedGame(game)
    )
}
export default GamesPage