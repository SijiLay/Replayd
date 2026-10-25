package com.replayd.service;

import com.replayd.dto.SportsEvent;
import com.replayd.dto.SportsScheduleResponse;
import com.replayd.model.Game;
import com.replayd.repository.GameRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SportsDataServiceTest {

    private GameRepository gameRepository;

    private SportsDataService sportsDataService;


    @BeforeEach
    void setUp() {
        gameRepository = mock(GameRepository.class);

        sportsDataService = spy(
                new SportsDataService(
                        "https://example.com",
                        "fake-api-key",
                        gameRepository
                )
        );
    }


    @Test
    void importNflScheduleCreatesNewGame() {

        SportsEvent event = createTestEvent();

        SportsScheduleResponse response =
                createResponse(event);

        doReturn(response)
                .when(sportsDataService)
                .getNflSchedule();

        when(gameRepository.findByExternalId("12345"))
                .thenReturn(Optional.empty());

        sportsDataService.importNflSchedule();

        verify(gameRepository).save(argThat(game ->
                game.getExternalId().equals("12345")
                        && game.getHomeTeam().equals("Steelers")
                        && game.getAwayTeam().equals("Ravens")
                        && game.getWeek() == 7
                        && game.getSeason() == 2026
                        && game.getHomeScore() == 24
                        && game.getAwayScore() == 21
        ));
    }


    @Test
    void importNflScheduleUpdatesExistingGame() {

        SportsEvent event = createTestEvent();

        SportsScheduleResponse response =
                createResponse(event);

        Game existingGame = new Game();
        existingGame.setExternalId("12345");
        existingGame.setHomeScore(10);
        existingGame.setAwayScore(7);

        doReturn(response)
                .when(sportsDataService)
                .getNflSchedule();

        when(gameRepository.findByExternalId("12345"))
                .thenReturn(Optional.of(existingGame));

        sportsDataService.importNflSchedule();

        assertEquals(24, existingGame.getHomeScore());
        assertEquals(21, existingGame.getAwayScore());
        assertEquals("FT", existingGame.getStatus());

        verify(gameRepository).save(existingGame);
    }


    @Test
    void importNflScheduleSkipsPreseasonGames() {

        SportsEvent event = createTestEvent();

        event.setIntRound("500");

        SportsScheduleResponse response =
                createResponse(event);

        doReturn(response)
                .when(sportsDataService)
                .getNflSchedule();

        sportsDataService.importNflSchedule();

        verify(gameRepository, never())
                .save(any(Game.class));
    }

    @Test
    void importNflScheduleHandlesBlankScores() {

        SportsEvent event = createTestEvent();

        event.setIntHomeScore("");
        event.setIntAwayScore("   ");

        SportsScheduleResponse response =
                createResponse(event);

        doReturn(response)
                .when(sportsDataService)
                .getNflSchedule();

        when(gameRepository.findByExternalId("12345"))
                .thenReturn(Optional.empty());

        sportsDataService.importNflSchedule();

        verify(gameRepository).save(argThat(game ->
                game.getHomeScore() == null
                        && game.getAwayScore() == null
        ));
    }

    @Test
    void importNflScheduleHandlesNullResponse() {

        doReturn(null)
                .when(sportsDataService)
                .getNflSchedule();

        sportsDataService.importNflSchedule();

        verify(gameRepository, never())
                .save(any(Game.class));
    }

    @Test
    void importNflScheduleHandlesNullSchedule() {

        SportsScheduleResponse response =
                new SportsScheduleResponse();

        response.setSchedule(null);

        doReturn(response)
                .when(sportsDataService)
                .getNflSchedule();

        sportsDataService.importNflSchedule();

        verify(gameRepository, never())
                .save(any(Game.class));
    }


    private SportsEvent createTestEvent() {

        SportsEvent event = new SportsEvent();

        event.setIdEvent("12345");
        event.setStrHomeTeam("Steelers");
        event.setStrAwayTeam("Ravens");

        event.setStrTimestamp(
                "2026-10-25T17:00:00"
        );

        event.setStrSeason("2026");
        event.setIntRound("7");
        event.setStrSport("American Football");

        event.setIntHomeScore("24");
        event.setIntAwayScore("21");

        event.setStrStatus("FT");

        event.setStrHomeTeamBadge(
                "https://example.com/steelers.png"
        );

        event.setStrAwayTeamBadge(
                "https://example.com/ravens.png"
        );

        return event;
    }


    private SportsScheduleResponse createResponse(
            SportsEvent event
    ) {

        SportsScheduleResponse response =
                new SportsScheduleResponse();

        response.setSchedule(List.of(event));

        return response;
    }


}