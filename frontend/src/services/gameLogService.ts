export type GameLogRequest = {
    gameId: number
    rating: number | null
    reviewText: string | null
}

const API_URL = "http://localhost:8080/game-logs"

export async function logGame(request: GameLogRequest) {
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