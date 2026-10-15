import type { Game } from "../types/Game"
import { Link } from "react-router-dom"

type GameCardProps = {
    game: Game
}

function GameCard({ game }: GameCardProps) {
    return (
        <article>
            <Link to={`/games/${game.id}`}>
                <h2>
                    {game.awayTeam} at {game.homeTeam}
                </h2>
            </Link>

            <p>
                {game.sport} — Week {game.week} — {game.season}
            </p>

            <p>{new Date(game.gameDate).toLocaleString()}</p>
        </article>
    )
}

export default GameCard