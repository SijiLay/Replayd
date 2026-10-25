package com.replayd.controller;

import com.replayd.dto.GameLogRequest;
import com.replayd.model.Game;
import com.replayd.model.GameLog;
import com.replayd.model.WatchType;
import com.replayd.service.GameLogService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class GameLogControllerTest {

    private GameLogService gameLogService;
    private GameLogController gameLogController;

    @BeforeEach
    void setUp() {
        gameLogService = mock(GameLogService.class);
        gameLogController = new GameLogController(gameLogService);
    }


    @Test
    void getAllGameLogsReturnsLogsFromService() {

        GameLog log1 = new GameLog();
        GameLog log2 = new GameLog();

        when(gameLogService.getAllGameLogs())
                .thenReturn(List.of(log1, log2));

        List<GameLog> result =
                gameLogController.getAllGameLogs();

        assertEquals(2, result.size());

        verify(gameLogService).getAllGameLogs();
    }


    @Test
    void getGameLogByIdReturnsLogFromService() {

        GameLog gameLog = new GameLog();

        when(gameLogService.getGameLogById(1L))
                .thenReturn(gameLog);

        GameLog result =
                gameLogController.getGameLogById(1L);

        assertSame(gameLog, result);

        verify(gameLogService).getGameLogById(1L);
    }


    @Test
    void getGameLogByGameIdReturnsOkWhenLogExists() {

        GameLog gameLog = new GameLog();

        when(gameLogService.getGameLogByGameId(1L))
                .thenReturn(gameLog);

        ResponseEntity<GameLog> response =
                gameLogController.getGameLogByGameId(1L);

        assertEquals(200, response.getStatusCode().value());
        assertSame(gameLog, response.getBody());

        verify(gameLogService).getGameLogByGameId(1L);
    }


    @Test
    void getGameLogByGameIdReturnsNotFoundWhenLogDoesNotExist() {

        when(gameLogService.getGameLogByGameId(1L))
                .thenReturn(null);

        ResponseEntity<GameLog> response =
                gameLogController.getGameLogByGameId(1L);

        assertEquals(404, response.getStatusCode().value());
        assertNull(response.getBody());

        verify(gameLogService).getGameLogByGameId(1L);
    }


    @Test
    void logGamePassesRequestToService() {

        Game game = new Game();

        GameLog savedLog = new GameLog(
                game,
                WatchType.FULL_GAME,
                4.5,
                "Great game"
        );

        GameLogRequest request = new GameLogRequest();

        request.setGameId(1L);
        request.setWatchType(WatchType.FULL_GAME);
        request.setRating(4.5);
        request.setReviewText("Great game");

        when(gameLogService.logGame(
                1L,
                WatchType.FULL_GAME,
                4.5,
                "Great game"
        )).thenReturn(savedLog);

        GameLog result =
                gameLogController.logGame(request);

        assertSame(savedLog, result);

        verify(gameLogService).logGame(
                1L,
                WatchType.FULL_GAME,
                4.5,
                "Great game"
        );
    }
}