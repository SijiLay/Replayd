package com.replayd.controller;

import com.replayd.model.Game;
import com.replayd.service.GameService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class GameControllerTest {

    private GameService gameService;
    private GameController gameController;

    @BeforeEach
    void setUp() {
        gameService = mock(GameService.class);
        gameController = new GameController(gameService);
    }


    @Test
    void getAllGamesReturnsGamesFromService() {

        Game game1 = new Game();
        game1.setHomeTeam("Patriots");

        Game game2 = new Game();
        game2.setHomeTeam("Steelers");

        when(gameService.getAllGames())
                .thenReturn(List.of(game1, game2));

        List<Game> result =
                gameController.getAllGames();

        assertEquals(2, result.size());
        assertEquals(
                "Patriots",
                result.get(0).getHomeTeam()
        );

        verify(gameService).getAllGames();
    }


    @Test
    void getGameByIdReturnsGameFromService() {

        Game game = new Game();

        game.setHomeTeam("Patriots");
        game.setAwayTeam("Bills");

        when(gameService.getGameById(1L))
                .thenReturn(game);

        Game result =
                gameController.getGameById(1L);

        assertEquals(
                "Patriots",
                result.getHomeTeam()
        );

        assertEquals(
                "Bills",
                result.getAwayTeam()
        );

        verify(gameService).getGameById(1L);
    }


    @Test
    void createGameReturnsSavedGame() {

        Game game = new Game();

        game.setHomeTeam("Patriots");
        game.setAwayTeam("Bills");

        when(gameService.createGame(game))
                .thenReturn(game);

        Game result =
                gameController.createGame(game);

        assertSame(game, result);

        verify(gameService).createGame(game);
    }
}