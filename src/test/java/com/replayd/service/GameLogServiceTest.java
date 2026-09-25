package com.replayd.service;

import com.replayd.exception.GameNotFoundException;
import com.replayd.model.Game;
import com.replayd.model.GameLog;
import com.replayd.repository.GameLogRepository;
import com.replayd.repository.GameRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class GameLogServiceTest {

    @Mock
    private GameLogRepository gameLogRepository;

    @Mock
    private GameRepository gameRepository;

    private GameLogService gameLogService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        gameLogService = new GameLogService(
                gameLogRepository,
                gameRepository
        );
    }

    @Test
    void logGameCreatesNewGameLogWhenOneDoesNotExist() {

        Game game = new Game(
                "Steelers",
                "Ravens",
                LocalDateTime.now(),
                2026,
                1,
                "NFL"
        );

        when(gameRepository.findById(1L))
                .thenReturn(Optional.of(game));

        when(gameLogRepository.findByGameId(1L))
                .thenReturn(Optional.empty());

        when(gameLogRepository.save(any(GameLog.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        GameLog result = gameLogService.logGame(
                1L,
                5,
                "Great game"
        );

        assertNotNull(result);
        assertEquals(5, result.getRating());
        assertEquals("Great game", result.getReviewText());
        assertEquals(game, result.getGame());
        assertNotNull(result.getLoggedAt());

        verify(gameLogRepository, times(1))
                .save(any(GameLog.class));
    }

    @Test
    void logGameUpdatesExistingGameLogInsteadOfCreatingDuplicate() {

        Game game = new Game(
                "Steelers",
                "Ravens",
                LocalDateTime.now(),
                2026,
                1,
                "NFL"
        );

        GameLog existingLog = new GameLog(
                game,
                5,
                "Amazing game"
        );

        when(gameRepository.findById(1L))
                .thenReturn(Optional.of(game));

        when(gameLogRepository.findByGameId(1L))
                .thenReturn(Optional.of(existingLog));

        when(gameLogRepository.save(existingLog))
                .thenReturn(existingLog);

        GameLog result = gameLogService.logGame(
                1L,
                4,
                "Good game"
        );

        assertEquals(4, result.getRating());
        assertEquals("Good game", result.getReviewText());

        verify(gameLogRepository, times(1))
                .save(existingLog);
    }

    @Test
    void logGameAllowsNullRatingAndReview() {

        Game game = new Game(
                "Steelers",
                "Ravens",
                LocalDateTime.now(),
                2026,
                1,
                "NFL"
        );

        when(gameRepository.findById(1L))
                .thenReturn(Optional.of(game));

        when(gameLogRepository.findByGameId(1L))
                .thenReturn(Optional.empty());

        when(gameLogRepository.save(any(GameLog.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        GameLog result = gameLogService.logGame(
                1L,
                null,
                null
        );

        assertNotNull(result);
        assertNull(result.getRating());
        assertNull(result.getReviewText());
    }

    @Test
    void logGameThrowsExceptionWhenGameDoesNotExist() {

        when(gameRepository.findById(999L))
                .thenReturn(Optional.empty());

        assertThrows(
                GameNotFoundException.class,
                () -> gameLogService.logGame(
                        999L,
                        5,
                        "Test"
                )
        );

        verify(gameLogRepository, never())
                .save(any(GameLog.class));
    }
}