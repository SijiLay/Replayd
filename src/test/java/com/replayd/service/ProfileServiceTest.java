package com.replayd.service;

import com.replayd.dto.ProfileResponse;
import com.replayd.model.Role;
import com.replayd.model.User;
import com.replayd.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ProfileServiceTest {

    private UserRepository userRepository;
    private ProfileService profileService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        profileService = new ProfileService(userRepository);
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("replayd-user", null)
        );
    }

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void getCurrentProfileReturnsProfileForAuthenticatedUsername() {
        User user = new User(
                "replayd-user",
                "user@example.com",
                "hashed-password",
                Role.USER
        );
        user.setId(42L);
        when(userRepository.findByUsername("replayd-user"))
                .thenReturn(Optional.of(user));

        ProfileResponse profile = profileService.getCurrentProfile();

        assertEquals(42L, profile.getId());
        assertEquals("replayd-user", profile.getUsername());
        assertEquals("user@example.com", profile.getEmail());
        assertEquals(Role.USER, profile.getRole());
        assertFalse(profile.isPrivateProfile());
        verify(userRepository).findByUsername("replayd-user");
    }

    @Test
    void updateProfilePrivacySavesPrivacyForAuthenticatedUser() {
        User user = new User(
                "replayd-user",
                "user@example.com",
                "hashed-password",
                Role.USER
        );
        user.setId(42L);
        when(userRepository.findByUsername("replayd-user"))
                .thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ProfileResponse profile =
                profileService.updateProfilePrivacy(true);

        assertEquals(42L, profile.getId());
        assertEquals("replayd-user", profile.getUsername());
        assertEquals("user@example.com", profile.getEmail());
        assertEquals(Role.USER, profile.getRole());
        assertTrue(profile.isPrivateProfile());
        verify(userRepository).findByUsername("replayd-user");
        verify(userRepository).save(user);
    }
}
