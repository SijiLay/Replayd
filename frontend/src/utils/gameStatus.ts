import type { Game } from "../types/Game"

export function isFinishedGame(game: Game) {
    return (
        game.status === "Final" ||
        game.status === "Final/OT" ||
        game.status === "FT" ||
        game.status === "AOT"
    )
}

export function isLiveGame(game: Game) {
    return (
        game.status !== null &&
        game.status !== "NS" &&
        !isFinishedGame(game)
    )
}

export function getDisplayStatus(game: Game) {
    if (game.status === "FT" || game.status === "Final") {
        return "FINAL"
    }

    if (game.status === "AOT" || game.status === "Final/OT") {
        return "FINAL/OT"
    }

    return game.status ?? "Scheduled"
}