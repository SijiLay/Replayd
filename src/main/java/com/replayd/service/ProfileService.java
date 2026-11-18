package com.replayd.service;

import com.replayd.dto.ProfileResponse;
import com.replayd.model.User;
import com.replayd.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {

    private final UserRepository userRepository;

    public ProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public ProfileResponse getCurrentProfile() {
        return toProfileResponse(getCurrentUser());
    }

    public ProfileResponse updateProfilePrivacy(boolean privateProfile) {
        User user = getCurrentUser();
        user.setPrivateProfile(privateProfile);
        User savedUser = userRepository.save(user);
        return toProfileResponse(savedUser);
    }

    private User getCurrentUser() {
        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String username = authentication.getName();

        return userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );
    }

    private ProfileResponse toProfileResponse(User user) {
        return new ProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.isPrivateProfile()
        );
    }
}