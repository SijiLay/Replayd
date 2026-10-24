package com.replayd.service;

import com.replayd.exception.GameNotFoundException;
import com.replayd.model.Game;
import com.replayd.model.GameLog;
import com.replayd.model.WatchType;
import com.replayd.repository.GameLogRepository;
import com.replayd.repository.GameRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GameLogService {

    private final GameLogRepository gameLogRepository;
    private final GameRepository gameRepository;

    public GameLogService(GameLogRepository gameLogRepository,
                          GameRepository gameRepository) {
        this.gameLogRepository = gameLogRepository;
        this.gameRepository = gameRepository;
    }

    public List<GameLog> getAllGameLogs() {
        return gameLogRepository.findAll();
    }

    public GameLog getGameLogById(Long id) {
        return gameLogRepository.findById(id).orElse(null);
    }

    public GameLog logGame(
            Long gameId,
            WatchType watchType,
            Integer rating,
            String reviewText
    ) {

        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new GameNotFoundException(gameId));

        WatchType finalWatchType =
                watchType == null ? WatchType.FULL_GAME : watchType;

        Optional<GameLog> existingLog =
                gameLogRepository.findByGameId(gameId);

        if (existingLog.isPresent()) {
            GameLog gameLog = existingLog.get();

            gameLog.setWatchType(finalWatchType);
            gameLog.setRating(rating);
            gameLog.setReviewText(reviewText);

            return gameLogRepository.save(gameLog);
        }

        GameLog newGameLog =
                new GameLog(game, finalWatchType, rating, reviewText);

        return gameLogRepository.save(newGameLog);
    }

    public GameLog getGameLogByGameId(Long gameId) {
        return gameLogRepository.findByGameId(gameId).orElse(null);
    }
}