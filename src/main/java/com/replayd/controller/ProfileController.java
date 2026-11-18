package com.replayd.controller;

import com.replayd.dto.ProfileResponse;
import com.replayd.dto.UpdateProfilePrivacyRequest;
import com.replayd.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/me")
    public ProfileResponse getCurrentProfile() {
        return profileService.getCurrentProfile();
    }

    @PatchMapping("/privacy")
    public ProfileResponse updatePrivacy(
            @Valid @RequestBody UpdateProfilePrivacyRequest request
    ) {
        return profileService.updateProfilePrivacy(
                request.getPrivateProfile()
        );
    }
}
