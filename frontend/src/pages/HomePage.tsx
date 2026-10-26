import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import type { GameLog } from "../types/GameLog"
import type { Game } from "../types/Game"

import { getGameLogs } from "../services/gameLogService"
import { getGames } from "../services/gameService"

import StarRating from "../components/StarRating"
import GameCard from "../components/GameCard"

import "./HomePage.css"

function HomePage() {
    const [recentLogs, setRecentLogs] = useState<GameLog[]>([])
    const [thisWeekGames, setThisWeekGames] = useState<Game[]>([])

    const [logsLoading, setLogsLoading] = useState(true)
    const [gamesLoading, setGamesLoading] = useState(true)

    const isLoggedIn = localStorage.getItem("token") !== null

    useEffect(() => {

        async function loadRecentLogs() {

            if (!isLoggedIn) {
                setRecentLogs([])
                setLogsLoading(false)
                return
            }

            try {
                const logs = await getGameLogs()

                const recent = [...logs]
                    .sort(
                        (a, b) =>
                            new Date(b.loggedAt).getTime() -
                            new Date(a.loggedAt).getTime()
                    )
                    .slice(0, 3)

                setRecentLogs(recent)

            } catch {
                console.error("Could not load recent Replayd games")
            } finally {
                setLogsLoading(false)
            }
        }

        async function loadGames() {
            try {
                const games = await getGames()

                setThisWeekGames(
                    getHomeGames(games)
                )

            } catch {
                console.error("Could not load games")
            } finally {
                setGamesLoading(false)
            }
        }

        loadRecentLogs()
        loadGames()

        const refreshInterval = setInterval(async () => {
            try {
                const games = await getGames()

                setThisWeekGames(
                    getHomeGames(games)
                )
            } catch {
                console.error("Could not refresh Home games")
            }
        }, 60000)

        return () => {
            clearInterval(refreshInterval)
        }

    }, [isLoggedIn])

    return (
        <main className="home-page">

            <section className="home-hero">
                <h1>Replayd</h1>

                <p>
                    Track, rate, and review the games you watch.
                </p>

                <Link
                    to="/games"
                    className="home-primary-link"
                >
                    Browse Games
                </Link>
            </section>


            {isLoggedIn && (
                <section className="recent-section">

                    <div className="section-header">
                        <h2>Recently Replayd</h2>

                        <Link to="/history">
                            View History
                        </Link>
                    </div>

                    {logsLoading && (
                        <p>Loading recent games...</p>
                    )}

                    {!logsLoading && recentLogs.length === 0 && (
                        <p>No games Replayd yet.</p>
                    )}

                    <div className="recent-grid">

                        {recentLogs.map((gameLog) => (
                            <Link
                                key={gameLog.id}
                                to={`/history/${gameLog.id}`}
                                className="recent-card"
                            >

                                <div className="recent-card-teams">

                                    <div className="recent-card-team">
                                        {gameLog.game.awayTeamBadge && (
                                            <img
                                                src={gameLog.game.awayTeamBadge}
                                                alt={`${gameLog.game.awayTeam} logo`}
                                                className="recent-card-logo"
                                            />
                                        )}

                                        <span>
                                            {gameLog.game.awayTeam}
                                        </span>
                                    </div>

                                    <div className="recent-card-team">
                                        {gameLog.game.homeTeamBadge && (
                                            <img
                                                src={gameLog.game.homeTeamBadge}
                                                alt={`${gameLog.game.homeTeam} logo`}
                                                className="recent-card-logo"
                                            />
                                        )}

                                        <span>
                                            {gameLog.game.homeTeam}
                                        </span>
                                    </div>

                                </div>

                                <p className="recent-watch-type">
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
            )}


            <section className="this-week-section">

                <div className="section-header">
                    <h2>This Week</h2>

                    <Link to="/games">
                        View All Games
                    </Link>
                </div>

                {gamesLoading && (
                    <p>Loading games...</p>
                )}

                {!gamesLoading && thisWeekGames.length === 0 && (
                    <p>No games found.</p>
                )}

                <div className="this-week-grid">

                    {thisWeekGames.map((game) => (
                        <GameCard
                            key={game.id}
                            game={game}
                        />
                    ))}

                </div>

            </section>

        </main>
    )
}

function getHomeGames(games: Game[]) {

    if (games.length === 0) {
        return []
    }

    const now = new Date()

    const liveGames = games.filter(isLiveGame)

    const upcomingGames = games
        .filter(
            (game) =>
                !isLiveGame(game) &&
                !isFinishedGame(game) &&
                new Date(game.gameDate) >= now
        )
        .sort(
            (a, b) =>
                new Date(a.gameDate).getTime() -
                new Date(b.gameDate).getTime()
        )

    let weekToShow: number

    if (liveGames.length > 0) {
        weekToShow = liveGames[0].week
    } else if (upcomingGames.length > 0) {
        weekToShow = upcomingGames[0].week
    } else {
        const latestGame = [...games].sort(
            (a, b) =>
                new Date(b.gameDate).getTime() -
                new Date(a.gameDate).getTime()
        )[0]

        weekToShow = latestGame.week
    }

    return games
        .filter((game) => game.week === weekToShow)
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
        .slice(0, 4)
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

export default HomePage