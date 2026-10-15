import type { GameLog } from "../types/GameLog"

export type GameLogRequest = {
    gameId: number
    rating: number | null
    reviewText: string | null
}

const API_URL = "http://localhost:8080/game-logs"

export async function logGame(request: GameLogRequest): Promise<GameLog> {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    })

    if (!response.ok) {
        throw new Error("Failed to log game")
    }

    return response.json()
}

export async function getGameLogs(): Promise<GameLog[]> {
    const response = await fetch(API_URL)

    if (!response.ok) {
        throw new Error("Failed to fetch game logs")
    }

    return response.json()
}

export async function getGameLogById(id: number): Promise<GameLog> {
    const response = await fetch(`${API_URL}/${id}`)

    if (!response.ok) {
        throw new Error("Failed to fetch game log")
    }
    return response.json()
}

export async function getGameLogByGameId(
    gameId: number
): Promise<GameLog | null> {
    const response = await fetch(`${API_URL}/game/${gameId}`)

    if (response.status === 404) {
        return null
    }

    if (!response.ok) {
        throw new Error("Failed to fetch game log")
    }

    return response.json()
}