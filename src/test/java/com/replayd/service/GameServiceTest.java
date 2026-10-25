package com.replayd.service;

import com.replayd.exception.GameNotFoundException;
import com.replayd.model.Game;
import com.replayd.repository.GameRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GameServiceTest {

    @Mock
    private GameRepository gameRepository;

    @InjectMocks
    private GameService gameService;


    @Test
    void getAllGamesReturnsAllGames() {
        Game game1 = new Game();
        game1.setHomeTeam("Patriots");
        game1.setAwayTeam("Bills");

        Game game2 = new Game();
        game2.setHomeTeam("Steelers");
        game2.setAwayTeam("Ravens");

        when(gameRepository.findAll())
                .thenReturn(List.of(game1, game2));

        List<Game> result = gameService.getAllGames();

        assertEquals(2, result.size());
        assertEquals("Patriots", result.get(0).getHomeTeam());
        assertEquals("Steelers", result.get(1).getHomeTeam());

        verify(gameRepository).findAll();
    }


    @Test
    void getGameByIdReturnsGameWhenGameExists() {
        Game game = new Game();
        game.setHomeTeam("Patriots");
        game.setAwayTeam("Bills");

        when(gameRepository.findById(1L))
                .thenReturn(Optional.of(game));

        Game result = gameService.getGameById(1L);

        assertEquals("Patriots", result.getHomeTeam());
        assertEquals("Bills", result.getAwayTeam());

        verify(gameRepository).findById(1L);
    }


    @Test
    void getGameByIdThrowsExceptionWhenGameDoesNotExist() {
        when(gameRepository.findById(99L))
                .thenReturn(Optional.empty());

        assertThrows(
                GameNotFoundException.class,
                () -> gameService.getGameById(99L)
        );

        verify(gameRepository).findById(99L);
    }


    @Test
    void createGameSavesAndReturnsGame() {
        Game game = new Game();
        game.setHomeTeam("Patriots");
        game.setAwayTeam("Bills");

        when(gameRepository.save(game))
                .thenReturn(game);

        Game result = gameService.createGame(game);

        assertEquals("Patriots", result.getHomeTeam());
        assertEquals("Bills", result.getAwayTeam());

        verify(gameRepository).save(game);
    }
}