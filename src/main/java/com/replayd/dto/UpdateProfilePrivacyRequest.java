package com.replayd.dto;

import jakarta.validation.constraints.NotNull;

public class UpdateProfilePrivacyRequest {

    @NotNull
    private Boolean privateProfile;

    public Boolean getPrivateProfile() {
        return privateProfile;
    }

    public void setPrivateProfile(Boolean privateProfile) {
        this.privateProfile = privateProfile;
    }
}
