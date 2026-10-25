package com.replayd.dto;

public class LiveScoreEvent {

    private String idEvent;
    private String intHomeScore;
    private String intAwayScore;
    private String strProgress;

    public LiveScoreEvent() {
    }

    public String getIdEvent() {
        return idEvent;
    }

    public void setIdEvent(String idEvent) {
        this.idEvent = idEvent;
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

    public String getStrProgress() {
        return strProgress;
    }

    public void setStrProgress(String strProgress) {
        this.strProgress = strProgress;
    }
}