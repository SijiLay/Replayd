import { useEffect, useState } from "react" //use state stores temporary page data
import { useParams } from "react-router-dom" //gets id
import type { Game } from "../types/Game"
import { getGameById } from "../services/gameService"
import { getGameLogByGameId, logGame } from "../services/gameLogService"
import "./GameDetailPage.css"
import StarRating from "../components/StarRating"


function GameDetailPage() {
    const { id } = useParams()

    const [game, setGame] = useState<Game | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [rating, setRating] = useState<number | null>(null)
    const [reviewText, setReviewText] = useState("")
    const [saving, setSaving] = useState(false)
    const [saveMessage, setSaveMessage] = useState<string | null>(null)
    const [isLogged, setIsLogged] = useState(false)
    const [watchType, setWatchType] =
        useState<"FULL_GAME" | "HIGHLIGHTS">("FULL_GAME")


    useEffect(() => {
        async function loadGame() {
            try {
                if (!id) {
                    setError("Game not found")
                    return
                }

                const data = await getGameById(Number(id))
                setGame(data)

                const existingLog = await getGameLogByGameId(Number(id))

                if (existingLog) {
                    setIsLogged(true)
                    setWatchType(existingLog.watchType)
                    setRating(existingLog.rating)
                    setReviewText(existingLog.reviewText ?? "")
                }
            } catch {
                setError("Could not load game")
            } finally {
                setLoading(false)
            }
        }

        loadGame()
    }, [id])

    async function handleReplayd() {
        if (!game) return

        try {
            setSaving(true)
            setSaveMessage(null)

            await logGame({
                gameId: game.id,
                watchType,
                rating,
                reviewText: reviewText.trim() === "" ? null : reviewText,
            })

            setIsLogged(true);

            setSaveMessage("Game added to Replayd")
        } catch {
            setSaveMessage("Could not save game")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <p>Loading game...</p>
    }

    if (error || !game) {
        return <p>{error ?? "Game not found"}</p>
    }

    return (
        <main className="game-detail">

            <section className="game-detail-header">

                <div className="game-detail-team">
                    {game.awayTeamBadge && (
                        <img
                            src={game.awayTeamBadge}
                            alt={`${game.awayTeam} logo`}
                            className="game-detail-logo"
                        />
                    )}

                    <div className="game-detail-team-info">
            <span className="game-detail-team-name">
                {game.awayTeam}
            </span>

                        <span className="game-detail-score">
                {game.awayScore ?? "-"}
            </span>
                    </div>
                </div>

                <div className="game-detail-team">
                    {game.homeTeamBadge && (
                        <img
                            src={game.homeTeamBadge}
                            alt={`${game.homeTeam} logo`}
                            className="game-detail-logo"
                        />
                    )}

                    <div className="game-detail-team-info">
            <span className="game-detail-team-name">
                {game.homeTeam}
            </span>

                        <span className="game-detail-score">
                {game.homeScore ?? "-"}
            </span>
                    </div>
                </div>

                <p className="game-detail-meta">
                    {game.status === "FT"
                        ? "FINAL"
                        : game.status === "AOT"
                            ? "FINAL/OT"
                            : game.status ?? "Scheduled"}
                    {" • "}
                    Week {game.week}
                    {" • "}
                    {game.season}
                </p>

                <p>
                    {new Date(game.gameDate).toLocaleString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit"
                    })}
                </p>

            </section>

            <section className="log-panel">
                <h2>{isLogged ? "Update your Replayd" : "Log this game"}</h2>

                <div className="form-group">
                    <label>Watch Type</label>

                    <select
                        value={watchType}
                        onChange={(event) =>
                            setWatchType(
                                event.target.value as
                                    "FULL_GAME" | "HIGHLIGHTS"
                            )
                        }
                    >
                        <option value="FULL_GAME">Full Game</option>
                        <option value="HIGHLIGHTS">Highlights</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Rating</label>

                    <StarRating
                        value={rating}
                        onChange={setRating}
                    />
                </div>

                <div className="form-group">
                    <label>Review</label>

                    <textarea
                        value={reviewText}
                        onChange={(event) =>
                            setReviewText(event.target.value)
                        }
                        maxLength={1000}
                        placeholder="Write an optional review..."
                    />
                </div>

                <button
                    className="replayd-button"
                    onClick={handleReplayd}
                    disabled={saving}
                >
                    {saving
                        ? "Saving..."
                        : isLogged
                            ? "Update Replayd"
                            : "Mark as Replayd"}
                </button>

                {saveMessage && (
                    <p className="save-message">{saveMessage}</p>
                )}
            </section>

        </main>
    )
}

export default GameDetailPage