package com.replayd.dto;

import java.util.List;

public class SportsScheduleResponse {

    private List<SportsEvent> schedule;

    public SportsScheduleResponse() {
    }

    public List<SportsEvent> getSchedule() {
        return schedule;
    }

    public void setSchedule(List<SportsEvent> schedule) {
        this.schedule = schedule;
    }
}