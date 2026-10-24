import type { Game } from "./Game"

export type GameLog = {
    id: number
    game: Game
    loggedAt: string
    watchType: "FULL_GAME" | "HIGHLIGHTS"
    rating: number | null
    reviewText: string | null
}