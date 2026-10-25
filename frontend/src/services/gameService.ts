import type { Game } from "../types/Game"

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"

const API_URL = `${API_BASE_URL}/games`

export async function getGames(): Promise<Game[]> {
    const response = await fetch(API_URL)

    if (!response.ok) {
        throw new Error("Failed to fetch games")
    }

    return response.json() //changes response to json
}

export async function getGameById(id: number): Promise<Game> {
    const response = await fetch(`${API_URL}/${id}`)

    if (!response.ok) {
        throw new Error("Failed to fetch game")
    }

    return response.json()
}

