import type { Game } from "../types/Game"
import { Link } from "react-router-dom"
import "./GameCard.css"

type GameCardProps = {
    game: Game
}

function GameCard({ game }: GameCardProps) {
    return (
        <Link to={`/games/${game.id}`} className="game-card">
            <h2>
                {game.awayTeam} at {game.homeTeam}
            </h2>

            <p className="game-card-meta">
                {game.sport} • Week {game.week} • {game.season}
            </p>

            <p className="game-card-date">
                {new Date(game.gameDate).toLocaleString()}
            </p>
        </Link>
    )
}

export default GameCard