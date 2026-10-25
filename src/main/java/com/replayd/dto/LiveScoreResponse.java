package com.replayd.dto;

import java.util.List;

public class LiveScoreResponse {

    private List<LiveScoreEvent> livescore;

    public LiveScoreResponse() {
    }

    public List<LiveScoreEvent> getLivescore() {
        return livescore;
    }

    public void setLivescore(List<LiveScoreEvent> livescore) {
        this.livescore = livescore;
    }
}