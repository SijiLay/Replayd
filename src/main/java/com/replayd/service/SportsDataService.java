package com.replayd.service;

import com.replayd.dto.SportsEvent;
import com.replayd.dto.SportsScheduleResponse;
import com.replayd.dto.SportsSeasonResponse;
import com.replayd.model.Game;
import com.replayd.repository.GameRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;

@Service
public class SportsDataService {

    private final RestClient restClient;//sends request to TheSportsDB of what we want.
    private final GameRepository gameRepository;

    public SportsDataService(
            @Value("${thesportsdb.api.base-url}") String baseUrl,
            @Value("${thesportsdb.api.key}") String apiKey,
            GameRepository gameRepository
    ) {
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl) //sports api site
                .defaultHeader("X-API-KEY", apiKey)
                .build();

        this.gameRepository = gameRepository;
    }

    public SportsSeasonResponse getNflSeasons() {
        return restClient.get()
                .uri("/list/seasons/4391")
                .retrieve()
                .body(SportsSeasonResponse.class);
    }

    public SportsScheduleResponse getNflSchedule() {
        return restClient.get()
                .uri("/schedule/league/4391/2026")
                .retrieve()
                .body(SportsScheduleResponse.class);
    }

    public void importNflSchedule() {

        //gets the NFL schedule from TheSportsDB
        SportsScheduleResponse response = getNflSchedule();

        //goes through every game returned from TheSportsDB
        for (SportsEvent sportsEvent : response.getSchedule()) {

            //checks if Replayd already has this game using TheSportsDB's event ID
            Game game = gameRepository
                    .findByExternalId(sportsEvent.getIdEvent())
                    .orElse(new Game());

            //maps TheSportsDB data into a Replayd Game
            game.setExternalId(sportsEvent.getIdEvent());
            game.setHomeTeam(sportsEvent.getStrHomeTeam());
            game.setAwayTeam(sportsEvent.getStrAwayTeam());

            game.setGameDate(
                    LocalDateTime.parse(sportsEvent.getStrTimestamp())
            );

            game.setSeason(
                    Integer.parseInt(sportsEvent.getStrSeason())
            );

            game.setWeek(
                    Integer.parseInt(sportsEvent.getIntRound())
            );

            game.setSport(sportsEvent.getStrSport());

            //saves the new game or updates the existing game
            gameRepository.save(game);
        }
    }
}