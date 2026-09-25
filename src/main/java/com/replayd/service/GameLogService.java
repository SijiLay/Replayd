package com.replayd.service;

import com.replayd.exception.GameNotFoundException;
import com.replayd.model.Game;
import com.replayd.model.GameLog;
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

    public GameLog logGame(Long gameId, Integer rating, String reviewText) {

        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new GameNotFoundException(gameId));

        Optional<GameLog> existingLog = gameLogRepository.findByGameId(gameId);

        if (existingLog.isPresent()) {
            GameLog gameLog = existingLog.get();

            gameLog.setRating(rating);
            gameLog.setReviewText(reviewText);

            return gameLogRepository.save(gameLog);
        }

        GameLog newGameLog = new GameLog(game, rating, reviewText);

        return gameLogRepository.save(newGameLog);
    }
}