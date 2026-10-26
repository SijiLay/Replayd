import type { GameLog } from "../types/GameLog"

function getAuthHeaders(): HeadersInit {
    const headers: Record<string, string> = {
        "Content-Type": "application/json"
    }

    const token = localStorage.getItem("token")

    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    return headers
}

export type GameLogRequest = {
    gameId: number
    watchType: "FULL_GAME" | "HIGHLIGHTS"
    rating: number | null
    reviewText: string | null
}

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"

const API_URL = `${API_BASE_URL}/game-logs`

export async function logGame(
    request: GameLogRequest
): Promise<GameLog> {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(request)
    })

    if (!response.ok) {
        throw new Error("Failed to log game")
    }

    return response.json()
}

export async function getGameLogs(): Promise<GameLog[]> {
    const response = await fetch(API_URL, {
        headers: getAuthHeaders()
    })

    if (!response.ok) {
        throw new Error("Failed to fetch game logs")
    }

    return response.json()
}

export async function getGameLogById(
    id: number
): Promise<GameLog> {
    const response = await fetch(`${API_URL}/${id}`, {
        headers: getAuthHeaders()
    })

    if (!response.ok) {
        throw new Error("Failed to fetch game log")
    }

    return response.json()
}

export async function getGameLogByGameId(
    gameId: number
): Promise<GameLog | null> {
    const response = await fetch(
        `${API_URL}/game/${gameId}`,
        {
            headers: getAuthHeaders()
        }
    )

    if (response.status === 404) {
        return null
    }

    if (!response.ok) {
        throw new Error("Failed to fetch game log")
    }

    return response.json()
}