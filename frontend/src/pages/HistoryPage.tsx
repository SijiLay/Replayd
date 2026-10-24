import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import type { GameLog } from "../types/GameLog"
import type { Game } from "../types/Game"

import { getGameLogs } from "../services/gameLogService"
import { getGames } from "../services/gameService"

import StarRating from "../components/StarRating"

import "./HomePage.css"

function HomePage() {
    const [recentLogs, setRecentLogs] = useState<GameLog[]>([])
    const [thisWeekGames, setThisWeekGames] = useState<Game[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadHomePage() {
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

                const games = await getGames()

                const now = new Date()

                const upcomingGames = games
                    .filter((game) => new Date(game.gameDate) >= now)
                    .sort(
                        (a, b) =>
                            new Date(a.gameDate).getTime() -
                            new Date(b.gameDate).getTime()
                    )

                let weekToShow = 1

                if (upcomingGames.length > 0) {
                    weekToShow = upcomingGames[0].week
                } else if (games.length > 0) {
                    const latestGame = [...games].sort(
                        (a, b) =>
                            new Date(b.gameDate).getTime() -
                            new Date(a.gameDate).getTime()
                    )[0]

                    weekToShow = latestGame.week
                }

                const currentWeekGames = games
                    .filter((game) => game.week === weekToShow)
                    .sort(
                        (a, b) =>
                            new Date(a.gameDate).getTime() -
                            new Date(b.gameDate).getTime()
                    )
                    .slice(0, 4)

                setThisWeekGames(currentWeekGames)

            } finally {
                setLoading(false)
            }
        }

        loadHomePage()
    }, [])

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


            <section className="recent-section">

                <div className="section-header">
                    <h2>Recently Replayd</h2>

                    <Link to="/history">
                        View History
                    </Link>
                </div>

                {loading && (
                    <p>Loading recent games...</p>
                )}

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


            <section className="this-week-section">

                <div className="section-header">
                    <h2>This Week</h2>

                    <Link to="/games">
                        View All Games
                    </Link>
                </div>

                <div className="this-week-grid">

                    {thisWeekGames.map((game) => (
                        <Link
                            key={game.id}
                            to={`/games/${game.id}`}
                            className="this-week-card"
                        >

                            <div className="this-week-team">
                                {game.awayTeamBadge && (
                                    <img
                                        src={game.awayTeamBadge}
                                        alt={`${game.awayTeam} logo`}
                                    />
                                )}

                                <span>
                                    {game.awayTeam}
                                </span>
                            </div>

                            <div className="this-week-team">
                                {game.homeTeamBadge && (
                                    <img
                                        src={game.homeTeamBadge}
                                        alt={`${game.homeTeam} logo`}
                                    />
                                )}

                                <span>
                                    {game.homeTeam}
                                </span>
                            </div>

                            <p>
                                {new Date(game.gameDate).toLocaleString(
                                    "en-US",
                                    {
                                        weekday: "short",
                                        hour: "numeric",
                                        minute: "2-digit"
                                    }
                                )}
                            </p>

                        </Link>
                    ))}

                </div>

            </section>

        </main>
    )
}

export default HomePage