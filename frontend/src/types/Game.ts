export type Game = {
    id: number
    externalId: string | null
    homeTeam: string
    awayTeam: string
    gameDate: string
    season: number
    week: number
    sport: string

    homeScore: number | null
    awayScore: number | null
    status: string | null
    homeTeamBadge: string | null
    awayTeamBadge: string | null
}