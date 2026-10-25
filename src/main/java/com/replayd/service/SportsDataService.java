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
import java.time.ZoneOffset;

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

        //stops import if the API returns no schedule data
        if (response == null || response.getSchedule() == null) {
            return;
        }

        //goes through every game returned from TheSportsDB
        for (SportsEvent sportsEvent : response.getSchedule()) {

            if("500".equals(sportsEvent.getIntRound())){
                continue;
            }

            //checks if Replayd already has this game using TheSportsDB's event ID
            Game game = gameRepository
                    .findByExternalId(sportsEvent.getIdEvent())
                    .orElse(new Game());

            //maps TheSportsDB data into a Replayd Game
            game.setExternalId(sportsEvent.getIdEvent());
            game.setHomeTeam(sportsEvent.getStrHomeTeam());
            game.setAwayTeam(sportsEvent.getStrAwayTeam());

            game.setGameDate(
                    LocalDateTime
                            .parse(sportsEvent.getStrTimestamp())
                            .toInstant(ZoneOffset.UTC)
            );

            game.setSeason(
                    Integer.parseInt(sportsEvent.getStrSeason())
            );

            game.setWeek(
                    Integer.parseInt(sportsEvent.getIntRound())
            );

            game.setSport(sportsEvent.getStrSport());

            game.setHomeScore(
                    parseNullableInteger(sportsEvent.getIntHomeScore())
            );

            game.setAwayScore(
                    parseNullableInteger(sportsEvent.getIntAwayScore())
            );

            game.setStatus(sportsEvent.getStrStatus());

            game.setHomeTeamBadge(sportsEvent.getStrHomeTeamBadge());

            game.setAwayTeamBadge(sportsEvent.getStrAwayTeamBadge());

            gameRepository.save(game);
        }

    }

    private Integer parseNullableInteger(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return Integer.parseInt(value);
    }
}