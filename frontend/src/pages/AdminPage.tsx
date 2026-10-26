import { useState } from "react"

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"

export default function AdminPage() {
    const [message, setMessage] = useState<string | null>(null)

    function getAuthHeaders() {
        const token = localStorage.getItem("token")

        return {
            Authorization: `Bearer ${token}`
        }
    }

    async function importSchedule() {
        try {
            setMessage("Importing schedule...")

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

            setMessage("NFL schedule imported")
        } catch {
            setMessage("Could not import schedule")
        }
    }

    async function refreshLiveScores() {
        try {
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

            setMessage("Live scores refreshed")
        } catch {
            setMessage("Could not refresh live scores")
        }
    }

    return (
        <main>
            <h1>Replayd Admin</h1>

            <button onClick={importSchedule}>
                Import NFL Schedule
            </button>

            <button onClick={refreshLiveScores}>
                Refresh Live Scores
            </button>

            {message && <p>{message}</p>}
        </main>
    )
}