package com.replayd.service;

import com.replayd.exception.GameNotFoundException;
import com.replayd.model.Game;
import com.replayd.model.GameLog;
import com.replayd.model.WatchType;
import com.replayd.repository.GameLogRepository;
import com.replayd.repository.GameRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.Instant;
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

        Game game = new Game();

        game.setHomeTeam("Steelers");
        game.setAwayTeam("Ravens");
        game.setGameDate(Instant.now());
        game.setSeason(2026);
        game.setWeek(1);
        game.setSport("NFL");

        when(gameRepository.findById(1L))
                .thenReturn(Optional.of(game));

        when(gameLogRepository.findByGameId(1L))
                .thenReturn(Optional.empty());

        when(gameLogRepository.save(any(GameLog.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        GameLog result = gameLogService.logGame(
                1L,
                WatchType.FULL_GAME,
                5.0,
                "Great game"
        );

        assertNotNull(result);
        assertEquals(5.0, result.getRating());
        assertEquals("Great game", result.getReviewText());
        assertEquals(WatchType.FULL_GAME, result.getWatchType());
        assertEquals(game, result.getGame());
        assertNotNull(result.getLoggedAt());

        verify(gameLogRepository, times(1))
                .save(any(GameLog.class));
    }


    @Test
    void logGameUpdatesExistingGameLogInsteadOfCreatingDuplicate() {

        Game game = new Game();

        game.setHomeTeam("Steelers");
        game.setAwayTeam("Ravens");
        game.setGameDate(Instant.now());
        game.setSeason(2026);
        game.setWeek(1);
        game.setSport("NFL");

        GameLog existingLog = new GameLog(
                game,
                WatchType.FULL_GAME,
                5.0,
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
                WatchType.HIGHLIGHTS,
                4.0,
                "Good game"
        );

        assertEquals(4.0, result.getRating());
        assertEquals("Good game", result.getReviewText());
        assertEquals(WatchType.HIGHLIGHTS, result.getWatchType());

        verify(gameLogRepository, times(1))
                .save(existingLog);
    }


    @Test
    void logGameAllowsNullRatingAndReview() {

        Game game = new Game();

        game.setHomeTeam("Steelers");
        game.setAwayTeam("Ravens");
        game.setGameDate(Instant.now());
        game.setSeason(2026);
        game.setWeek(1);
        game.setSport("NFL");

        when(gameRepository.findById(1L))
                .thenReturn(Optional.of(game));

        when(gameLogRepository.findByGameId(1L))
                .thenReturn(Optional.empty());

        when(gameLogRepository.save(any(GameLog.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        GameLog result = gameLogService.logGame(
                1L,
                WatchType.FULL_GAME,
                null,
                null
        );

        assertNotNull(result);
        assertNull(result.getRating());
        assertNull(result.getReviewText());
        assertEquals(WatchType.FULL_GAME, result.getWatchType());
    }


    @Test
    void logGameUsesFullGameWhenWatchTypeIsNull() {

        Game game = new Game();

        game.setHomeTeam("Steelers");
        game.setAwayTeam("Ravens");
        game.setGameDate(Instant.now());
        game.setSeason(2026);
        game.setWeek(1);
        game.setSport("NFL");

        when(gameRepository.findById(1L))
                .thenReturn(Optional.of(game));

        when(gameLogRepository.findByGameId(1L))
                .thenReturn(Optional.empty());

        when(gameLogRepository.save(any(GameLog.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        GameLog result = gameLogService.logGame(
                1L,
                null,
                4.5,
                "Good game"
        );

        assertEquals(
                WatchType.FULL_GAME,
                result.getWatchType()
        );
    }


    @Test
    void logGameThrowsExceptionWhenGameDoesNotExist() {

        when(gameRepository.findById(999L))
                .thenReturn(Optional.empty());

        assertThrows(
                GameNotFoundException.class,
                () -> gameLogService.logGame(
                        999L,
                        WatchType.FULL_GAME,
                        5.0,
                        "Test"
                )
        );

        verify(gameLogRepository, never())
                .save(any(GameLog.class));
    }
}