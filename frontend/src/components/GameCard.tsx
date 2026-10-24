import { Link } from "react-router-dom"
import type { Game } from "../types/Game"
import "./GameCard.css"

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
                    {game.awayTeamBadge && (
                        <img
                            src={game.awayTeamBadge}
                            alt={`${game.awayTeam} logo`}
                            className="team-logo"
                        />
                    )}

                    <span className="team-name">
                        {game.awayTeam}
                    </span>

                    <span className="team-score">
                        {game.awayScore ?? "-"}
                    </span>
                </div>

                <div className="game-card-team">
                    {game.homeTeamBadge && (
                        <img
                            src={game.homeTeamBadge}
                            alt={`${game.homeTeam} logo`}
                            className="team-logo"
                        />
                    )}

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

export default GameCard