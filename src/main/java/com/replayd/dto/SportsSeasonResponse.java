package com.replayd.dto;

import java.util.List;

public class SportsSeasonResponse {

    private List<SportsSeason> list;

    public SportsSeasonResponse() {
    }

    public List<SportsSeason> getList() {
        return list;
    }

    public void setList(List<SportsSeason> list) {
        this.list = list;
    }
}