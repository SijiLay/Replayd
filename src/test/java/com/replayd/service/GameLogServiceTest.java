package com.replayd.service;

import com.replayd.exception.GameNotFoundException;
import com.replayd.model.Game;
import com.replayd.model.GameLog;
import com.replayd.model.Role;
import com.replayd.model.User;
import com.replayd.model.WatchType;
import com.replayd.repository.GameLogRepository;
import com.replayd.repository.GameRepository;
import com.replayd.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class GameLogServiceTest {

    @Mock
    private GameLogRepository gameLogRepository;

    @Mock
    private GameRepository gameRepository;

    @Mock
    private UserRepository userRepository;

    private GameLogService gameLogService;

    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        gameLogService = new GameLogService(
                gameLogRepository,
                gameRepository,
                userRepository
        );

        user = new User(
                "Siji",
                "siji@example.com",
                "hashedPassword",
                Role.USER
        );

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        "Siji",
                        null
                );

        SecurityContextHolder
                .getContext()
                .setAuthentication(authentication);

        when(userRepository.findByUsername("Siji"))
                .thenReturn(Optional.of(user));
    }


    @Test
    void logGameCreatesNewGameLogWhenOneDoesNotExist() {

        Game game = createGame();

        when(gameRepository.findById(1L))
                .thenReturn(Optional.of(game));

        when(gameLogRepository.findByGameIdAndUser(1L, user))
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
        assertEquals(user, result.getUser());
        assertNotNull(result.getLoggedAt());

        verify(gameLogRepository, times(1))
                .save(any(GameLog.class));
    }


    @Test
    void logGameUpdatesExistingGameLogInsteadOfCreatingDuplicate() {

        Game game = createGame();

        GameLog existingLog = new GameLog(
                game,
                WatchType.FULL_GAME,
                5.0,
                "Amazing game"
        );

        existingLog.setUser(user);

        when(gameRepository.findById(1L))
                .thenReturn(Optional.of(game));

        when(gameLogRepository.findByGameIdAndUser(1L, user))
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
        assertEquals(user, result.getUser());

        verify(gameLogRepository, times(1))
                .save(existingLog);
    }


    @Test
    void logGameAllowsNullRatingAndReview() {

        Game game = createGame();

        when(gameRepository.findById(1L))
                .thenReturn(Optional.of(game));

        when(gameLogRepository.findByGameIdAndUser(1L, user))
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
        assertEquals(user, result.getUser());
    }


    @Test
    void logGameUsesFullGameWhenWatchTypeIsNull() {

        Game game = createGame();

        when(gameRepository.findById(1L))
                .thenReturn(Optional.of(game));

        when(gameLogRepository.findByGameIdAndUser(1L, user))
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

        assertEquals(user, result.getUser());
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


    private Game createGame() {

        Game game = new Game();

        game.setHomeTeam("Steelers");
        game.setAwayTeam("Ravens");
        game.setGameDate(Instant.now());
        game.setSeason(2026);
        game.setWeek(1);
        game.setSport("NFL");

        return game;
    }
}