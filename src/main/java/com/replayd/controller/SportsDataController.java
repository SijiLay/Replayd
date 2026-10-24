package com.replayd.controller;

import com.replayd.dto.SportsScheduleResponse;
import com.replayd.dto.SportsSeasonResponse;
import com.replayd.service.SportsDataService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/sports-data")
public class SportsDataController {

    private final SportsDataService sportsDataService;

    public SportsDataController(SportsDataService sportsDataService) {
        this.sportsDataService = sportsDataService;
    }

    @GetMapping("/nfl/seasons")
    public SportsSeasonResponse getNflSeasons() {
        return sportsDataService.getNflSeasons();
    }

    @GetMapping("/nfl/schedule")
    public SportsScheduleResponse getNflSchedule() {
        return sportsDataService.getNflSchedule();
    }
}