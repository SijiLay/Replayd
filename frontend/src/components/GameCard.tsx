import { Link } from "react-router-dom"
import type { Game } from "../types/Game"
import "./GameCard.css"
import { useState } from "react"
import {
    isLiveGame,
    getDisplayStatus
} from "../utils/gameStatus"


type GameCardProps = {
    game: Game
}

function GameCard({ game }: GameCardProps) {

    const gameDate = new Date(game.gameDate)

    const formattedDate = gameDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric"
    })

    const formattedTime = gameDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
    })

    const displayStatus = getDisplayStatus(game)
    const isLive = isLiveGame(game)

    let liveClock: string | null = null
    let liveQuarter: string | null = null

    if (isLive && game.status) {

        if (game.status === "Halftime") {

            liveQuarter = "HALFTIME"

        } else {

            const parts = game.status.split(" - ")

            if (parts.length === 2) {

                liveClock = parts[0]

                const quarterMap: Record<string, string> = {
                    "1st": "Q1",
                    "2nd": "Q2",
                    "3rd": "Q3",
                    "4th": "Q4"
                }

                liveQuarter =
                    quarterMap[parts[1]] ?? parts[1]
            }
        }
    }

    return (
        <Link
            to={`/games/${game.id}`}
            className="game-card"
        >

            <div className="game-card-teams">

                <div className="game-card-team">

                    <TeamLogo
                        src={game.awayTeamBadge}
                        team={game.awayTeam}
                    />

                    <span className="team-name">
                        {game.awayTeam}
                    </span>

                    <span className="team-score">
                        {game.awayScore ?? "-"}
                    </span>

                </div>


                <div className="game-card-team">

                    <TeamLogo
                        src={game.homeTeamBadge}
                        team={game.homeTeam}
                    />

                    <span className="team-name">
                        {game.homeTeam}
                    </span>

                    <span className="team-score">
                        {game.homeScore ?? "-"}
                    </span>

                </div>

            </div>


            <div className="game-card-info">

                <div className="game-status-area">

                    {isLive ? (

                        <div className="live-status">

                            <span className="live-dot" />

                            <span className="live-label">
                                LIVE
                            </span>

                            {liveQuarter && (
                                <span className="live-quarter">
                                    {liveQuarter}
                                </span>
                            )}

                            {liveClock && (
                                <span className="live-clock">
                                    {liveClock}
                                </span>
                            )}

                        </div>

                    ) : (

                        <span className="game-status">
                            {displayStatus}
                        </span>

                    )}

                    <span className="game-week">
                        Week {game.week}
                    </span>

                </div>


                <span className="game-card-date">
                    {formattedDate} • {formattedTime}
                </span>

            </div>

        </Link>
    )
}


function TeamLogo({
                      src,
                      team
                  }: {
    src: string | null
    team: string
}) {

    const [imageFailed, setImageFailed] =
        useState(false)

    if (!src || imageFailed) {
        return (
            <div className="team-logo-fallback">
                {team.charAt(0)}
            </div>
        )
    }

    return (
        <img
            src={src}
            alt={`${team} logo`}
            className="team-logo"
            onError={() =>
                setImageFailed(true)
            }
        />
    )
}

export default GameCard