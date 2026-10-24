package com.replayd.dto;

public class SportsEvent {

    private String idEvent;
    private String strSeason;
    private String strSport;

    private String strHomeTeam;
    private String strAwayTeam;

    private String strTimestamp;

    private String intRound;

    private String intHomeScore;
    private String intAwayScore;

    private String strHomeTeamBadge;
    private String strAwayTeamBadge;

    private String strStatus;

    public SportsEvent() {
    }

    public String getIdEvent() {
        return idEvent;
    }

    public void setIdEvent(String idEvent) {
        this.idEvent = idEvent;
    }

    public String getStrSeason() {
        return strSeason;
    }

    public void setStrSeason(String strSeason) {
        this.strSeason = strSeason;
    }

    public String getStrSport() {
        return strSport;
    }

    public void setStrSport(String strSport) {
        this.strSport = strSport;
    }

    public String getStrHomeTeam() {
        return strHomeTeam;
    }

    public void setStrHomeTeam(String strHomeTeam) {
        this.strHomeTeam = strHomeTeam;
    }

    public String getStrAwayTeam() {
        return strAwayTeam;
    }

    public void setStrAwayTeam(String strAwayTeam) {
        this.strAwayTeam = strAwayTeam;
    }

    public String getStrTimestamp() {
        return strTimestamp;
    }

    public void setStrTimestamp(String strTimestamp) {
        this.strTimestamp = strTimestamp;
    }

    public String getIntRound() {
        return intRound;
    }

    public void setIntRound(String intRound) {
        this.intRound = intRound;
    }

    public String getIntHomeScore() {
        return intHomeScore;
    }

    public void setIntHomeScore(String intHomeScore) {
        this.intHomeScore = intHomeScore;
    }

    public String getIntAwayScore() {
        return intAwayScore;
    }

    public void setIntAwayScore(String intAwayScore) {
        this.intAwayScore = intAwayScore;
    }

    public String getStrHomeTeamBadge() {
        return strHomeTeamBadge;
    }

    public void setStrHomeTeamBadge(String strHomeTeamBadge) {
        this.strHomeTeamBadge = strHomeTeamBadge;
    }

    public String getStrAwayTeamBadge() {
        return strAwayTeamBadge;
    }

    public void setStrAwayTeamBadge(String strAwayTeamBadge) {
        this.strAwayTeamBadge = strAwayTeamBadge;
    }

    public String getStrStatus() {
        return strStatus;
    }

    public void setStrStatus(String strStatus) {
        this.strStatus = strStatus;
    }
}