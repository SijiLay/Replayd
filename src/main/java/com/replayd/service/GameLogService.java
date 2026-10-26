package com.replayd.service;

import com.replayd.exception.GameLogNotFoundException;
import com.replayd.exception.GameNotFoundException;
import com.replayd.model.Game;
import com.replayd.model.GameLog;
import com.replayd.model.User;
import com.replayd.model.WatchType;
import com.replayd.repository.GameLogRepository;
import com.replayd.repository.GameRepository;
import com.replayd.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GameLogService {

    private final GameLogRepository gameLogRepository;
    private final GameRepository gameRepository;
    private final UserRepository userRepository;

    public GameLogService(
            GameLogRepository gameLogRepository,
            GameRepository gameRepository,
            UserRepository userRepository
    ) {
        this.gameLogRepository = gameLogRepository;
        this.gameRepository = gameRepository;
        this.userRepository = userRepository;
    }

    public List<GameLog> getAllGameLogs() {
        User user = getCurrentUser();

        return gameLogRepository.findByUser(user);
    }

    public GameLog getGameLogById(Long id) {
        GameLog gameLog = gameLogRepository.findById(id)
                .orElseThrow(() -> new GameLogNotFoundException(id));

        User user = getCurrentUser();

        if (!gameLog.getUser().getId().equals(user.getId())) {
            throw new GameLogNotFoundException(id);
        }

        return gameLog;
    }

    public GameLog logGame(
            Long gameId,
            WatchType watchType,
            Double rating,
            String reviewText
    ) {

        User user = getCurrentUser();

        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new GameNotFoundException(gameId));

        WatchType finalWatchType =
                watchType == null ? WatchType.FULL_GAME : watchType;

        Optional<GameLog> existingLog =
                gameLogRepository.findByGameIdAndUser(gameId, user);

        if (existingLog.isPresent()) {
            GameLog gameLog = existingLog.get();

            gameLog.setWatchType(finalWatchType);
            gameLog.setRating(rating);
            gameLog.setReviewText(reviewText);

            return gameLogRepository.save(gameLog);
        }

        GameLog newGameLog =
                new GameLog(game, finalWatchType, rating, reviewText);

        newGameLog.setUser(user);

        return gameLogRepository.save(newGameLog);
    }

    public GameLog getGameLogByGameId(Long gameId) {
        User user = getCurrentUser();

        return gameLogRepository
                .findByGameIdAndUser(gameId, user)
                .orElse(null);
    }

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String username = authentication.getName();

        return userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );
    }
}