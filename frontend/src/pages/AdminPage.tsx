import { useState } from "react"
import "./AdminPage.css"

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"

export default function AdminPage() {
    const [message, setMessage] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    function getAuthHeaders() {
        const token = localStorage.getItem("token")

        return {
            Authorization: `Bearer ${token}`
        }
    }

    async function importSchedule() {
        try {
            setLoading(true)
            setMessage("Importing NFL schedule...")

            const response = await fetch(
                `${API_BASE_URL}/sports-data/nfl/import`,
                {
                    method: "POST",
                    headers: getAuthHeaders()
                }
            )

            if (!response.ok) {
                throw new Error()
            }

            setMessage("NFL schedule imported successfully.")
        } catch {
            setMessage("Could not import NFL schedule.")
        } finally {
            setLoading(false)
        }
    }

    async function refreshLiveScores() {
        try {
            setLoading(true)
            setMessage("Refreshing live scores...")

            const response = await fetch(
                `${API_BASE_URL}/sports-data/nfl/live/refresh`,
                {
                    method: "POST",
                    headers: getAuthHeaders()
                }
            )

            if (!response.ok) {
                throw new Error()
            }

            setMessage("Live scores refreshed successfully.")
        } catch {
            setMessage("Could not refresh live scores.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="admin-page">
            <section className="admin-card">
                <h1>Replayd Admin</h1>

                <p className="admin-subtitle">
                    Manage NFL data and live score updates.
                </p>

                <div className="admin-action">
                    <div>
                        <h2>Import NFL Schedule</h2>
                        <p>
                            Pull the NFL schedule from TheSportsDB
                            and save it to Replayd.
                        </p>
                    </div>

                    <button
                        onClick={importSchedule}
                        disabled={loading}
                    >
                        Import Schedule
                    </button>
                </div>

                <div className="admin-action">
                    <div>
                        <h2>Refresh Live Scores</h2>
                        <p>
                            Manually check TheSportsDB for current
                            NFL scores and game status.
                        </p>
                    </div>

                    <button
                        onClick={refreshLiveScores}
                        disabled={loading}
                    >
                        Refresh Scores
                    </button>
                </div>

                {message && (
                    <p className="admin-message">
                        {message}
                    </p>
                )}
            </section>
        </main>
    )
}