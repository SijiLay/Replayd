package com.replayd.dto;

import com.replayd.model.WatchType;
import jakarta.validation.constraints.*;

public class GameLogRequest { //this is the class that gets and saves data from databases
    private Long gameId;
    @DecimalMin("0.5")
    @DecimalMax("5.0")
    private Double rating;
    @Size(max = 1000)
    private String reviewText;
    private WatchType watchType;

    public Long getGameId() {
        return gameId;
    }

    public void setGameId(Long gameId) {
        this.gameId = gameId;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getReviewText() {
        return reviewText;
    }

    public void setReviewText(String reviewText) {
        this.reviewText = reviewText;
    }

    public WatchType getWatchType() {return watchType;}

    public void setWatchType(WatchType watchType) {this.watchType = watchType;}
}
