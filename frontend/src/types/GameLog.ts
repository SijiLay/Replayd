import type { Game } from "./Game"

export type GameLog = {
    id: number
    game: Game
    loggedAt: string
    rating: number | null
    reviewText: string | null
}