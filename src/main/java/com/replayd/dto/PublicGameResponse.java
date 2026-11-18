package com.replayd.dto;

import java.time.Instant;

public class PublicGameResponse {

    private Long id;
    private String homeTeam;
    private String awayTeam;
    private Instant gameDate;
    private int season;
    private int week;
    private String sport;
    private Integer homeScore;
    private Integer awayScore;
    private String status;
    private String homeTeamBadge;
    private String awayTeamBadge;

    public PublicGameResponse(
            Long id,
            String homeTeam,
            String awayTeam,
            Instant gameDate,
            int season,
            int week,
            String sport,
            Integer homeScore,
            Integer awayScore,
            String status,
            String homeTeamBadge,
            String awayTeamBadge
    ) {
        this.id = id;
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.gameDate = gameDate;
        this.season = season;
        this.week = week;
        this.sport = sport;
        this.homeScore = homeScore;
        this.awayScore = awayScore;
        this.status = status;
        this.homeTeamBadge = homeTeamBadge;
        this.awayTeamBadge = awayTeamBadge;
    }

    public Long getId() {
        return id;
    }

    public String getHomeTeam() {
        return homeTeam;
    }

    public String getAwayTeam() {
        return awayTeam;
    }

    public Instant getGameDate() {
        return gameDate;
    }

    public int getSeason() {
        return season;
    }

    public int getWeek() {
        return week;
    }

    public String getSport() {
        return sport;
    }

    public Integer getHomeScore() {
        return homeScore;
    }

    public Integer getAwayScore() {
        return awayScore;
    }

    public String getStatus() {
        return status;
    }

    public String getHomeTeamBadge() {
        return homeTeamBadge;
    }

    public String getAwayTeamBadge() {
        return awayTeamBadge;
    }
}
