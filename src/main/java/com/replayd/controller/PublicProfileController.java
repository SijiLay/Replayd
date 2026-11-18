package com.replayd.controller;

import com.replayd.dto.PublicProfileResponse;
import com.replayd.service.ProfileService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/profiles")
public class PublicProfileController {

    private final ProfileService profileService;

    public PublicProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/{username}")
    public PublicProfileResponse getPublicProfile(
            @PathVariable String username
    ) {
        return profileService.getPublicProfile(username);
    }
}
