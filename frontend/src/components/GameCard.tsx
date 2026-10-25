import { Link } from "react-router-dom"
import type { Game } from "../types/Game"
import "./GameCard.css"
import { useState } from "react"

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

    const displayStatus =
        game.status === "FT"
            ? "FINAL"
            : game.status === "AOT"
                ? "FINAL/OT"
                : game.status ?? "Scheduled"

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
                <span>
                    {displayStatus} • Week {game.week}
                </span>

                <span>
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
    const [imageFailed, setImageFailed] = useState(false)

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
            onError={() => setImageFailed(true)}
        />
    )
}

export default GameCard