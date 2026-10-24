package com.replayd.dto;

import com.replayd.model.WatchType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public class GameLogRequest {
    private Long gameId;
    @Min(1)
    @Max(5)
    private Integer rating;
    @Size(max = 1000)
    private String reviewText;
    private WatchType watchType;

    public Long getGameId() {
        return gameId;
    }

    public void setGameId(Long gameId) {
        this.gameId = gameId;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
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
