import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import type { Game } from "../types/Game"
import { getGameById } from "../services/gameService"
import { logGame } from "../services/gameLogService"

function GameDetailPage() {
    const { id } = useParams()

    const [game, setGame] = useState<Game | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [rating, setRating] = useState<number | null>(null)
    const [reviewText, setReviewText] = useState("")
    const [saving, setSaving] = useState(false)
    const [saveMessage, setSaveMessage] = useState<string | null>(null)

    useEffect(() => {
        async function loadGame() {
            try {
                if (!id) {
                    setError("Game not found")
                    return
                }

                const data = await getGameById(Number(id))
                setGame(data)
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
                rating,
                reviewText: reviewText.trim() === "" ? null : reviewText,
            })

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
        <main>
            <h1>
                {game.awayTeam} at {game.homeTeam}
            </h1>

            <p>
                {game.sport} — Week {game.week} — {game.season}
            </p>

            <p>{new Date(game.gameDate).toLocaleString()}</p>

            <section>
                <h2>Log this game</h2>

                <label>
                    Rating
                    <select
                        value={rating ?? ""}
                        onChange={(event) =>
                            setRating(
                                event.target.value === ""
                                    ? null
                                    : Number(event.target.value)
                            )
                        }
                    >
                        <option value="">No rating</option>
                        <option value="1">1 star</option>
                        <option value="2">2 stars</option>
                        <option value="3">3 stars</option>
                        <option value="4">4 stars</option>
                        <option value="5">5 stars</option>
                    </select>
                </label>

                <label>
                    Review
                    <textarea
                        value={reviewText}
                        onChange={(event) => setReviewText(event.target.value)}
                        maxLength={1000}
                        placeholder="Write an optional review..."
                    />
                </label>

                <button onClick={handleReplayd} disabled={saving}>
                    {saving ? "Saving..." : "Mark as Replayd"}
                </button>

                {saveMessage && <p>{saveMessage}</p>}
            </section>
        </main>
    )
}

export default GameDetailPage