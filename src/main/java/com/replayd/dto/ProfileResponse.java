package com.replayd.dto;

import com.replayd.model.Role;

public class ProfileResponse {

    private Long id;
    private String username;
    private String email;
    private Role role;
    private boolean privateProfile;

    public ProfileResponse(
            Long id,
            String username,
            String email,
            Role role,
            boolean privateProfile
    ) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.privateProfile = privateProfile;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }

    public boolean isPrivateProfile() {
        return privateProfile;
    }
}