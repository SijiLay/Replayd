package com.replayd.service;

import com.replayd.dto.SportsSeasonResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import com.replayd.dto.SportsScheduleResponse;

@Service
public class SportsDataService {

    private final RestClient restClient;//sends request to TheSportsDB of what we want.

    public SportsDataService(
            @Value("${thesportsdb.api.base-url}") String baseUrl,
            @Value("${thesportsdb.api.key}") String apiKey
    ) {
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl) //sports api site
                .defaultHeader("X-API-KEY", apiKey)
                .build();
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

}