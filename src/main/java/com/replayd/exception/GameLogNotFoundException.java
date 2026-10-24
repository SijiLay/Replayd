package com.replayd.exception;

public class GameLogNotFoundException extends RuntimeException {

    public GameLogNotFoundException(Long id) {
        super("Game log not found with id: " + id);
    }

}