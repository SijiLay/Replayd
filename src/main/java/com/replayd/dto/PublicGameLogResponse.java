package com.replayd.dto;

import com.replayd.model.WatchType;

import java.time.LocalDateTime;

public class PublicGameLogResponse {

    private Long id;
    private PublicGameResponse game;
    private LocalDateTime loggedAt;
    private WatchType watchType;
    private Double rating;
    private String reviewText;

    public PublicGameLogResponse(
            Long id,
            PublicGameResponse game,
            LocalDateTime loggedAt,
            WatchType watchType,
            Double rating,
            String reviewText
    ) {
        this.id = id;
        this.game = game;
        this.loggedAt = loggedAt;
        this.watchType = watchType;
        this.rating = rating;
        this.reviewText = reviewText;
    }

    public Long getId() {
        return id;
    }

    public PublicGameResponse getGame() {
        return game;
    }

    public LocalDateTime getLoggedAt() {
        return loggedAt;
    }

    public WatchType getWatchType() {
        return watchType;
    }

    public Double getRating() {
        return rating;
    }

    public String getReviewText() {
        return reviewText;
    }
}
