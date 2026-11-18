package com.replayd.dto;

import com.replayd.model.Role;

import java.util.List;

public class PublicProfileResponse {

    private Long id;
    private String username;
    private Role role;
    private boolean privateProfile;
    private List<PublicGameLogResponse> gameLogs;

    public PublicProfileResponse(
            Long id,
            String username,
            Role role,
            boolean privateProfile,
            List<PublicGameLogResponse> gameLogs
    ) {
        this.id = id;
        this.username = username;
        this.role = role;
        this.privateProfile = privateProfile;
        this.gameLogs = gameLogs;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public Role getRole() {
        return role;
    }

    public boolean isPrivateProfile() {
        return privateProfile;
    }

    public List<PublicGameLogResponse> getGameLogs() {
        return gameLogs;
    }
}
