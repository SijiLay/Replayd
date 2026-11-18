package com.replayd.service;

import com.replayd.dto.ProfileResponse;
import com.replayd.dto.PublicProfileResponse;
import com.replayd.model.Game;
import com.replayd.model.GameLog;
import com.replayd.model.Role;
import com.replayd.model.User;
import com.replayd.model.WatchType;
import com.replayd.repository.GameLogRepository;
import com.replayd.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;
import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ProfileServiceTest {

    private UserRepository userRepository;
    private GameLogRepository gameLogRepository;
    private ProfileService profileService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        gameLogRepository = mock(GameLogRepository.class);
        profileService = new ProfileService(userRepository, gameLogRepository);
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

    @Test
    void getPublicProfileIncludesPublicHistoryAndRedactsPrivateReviews() {
        User user = createUser(false);
        Game game = createGame();
        GameLog publicReview = createGameLog(game, false);
        GameLog privateReview = createGameLog(game, true);

        when(userRepository.findByUsername("replayd-user"))
                .thenReturn(Optional.of(user));
        when(gameLogRepository.findByUser(user))
                .thenReturn(List.of(publicReview, privateReview));

        PublicProfileResponse profile =
                profileService.getPublicProfile("replayd-user");

        assertEquals(42L, profile.getId());
        assertEquals("replayd-user", profile.getUsername());
        assertEquals(Role.USER, profile.getRole());
        assertFalse(profile.isPrivateProfile());
        assertEquals(2, profile.getGameLogs().size());
        assertEquals(5.0, profile.getGameLogs().get(0).getRating());
        assertEquals("Public review", profile.getGameLogs().get(0).getReviewText());
        assertNull(profile.getGameLogs().get(1).getRating());
        assertNull(profile.getGameLogs().get(1).getReviewText());
        verify(gameLogRepository).findByUser(user);
    }

    @Test
    void getPublicProfileHidesHistoryForPrivateProfile() {
        User user = createUser(true);
        when(userRepository.findByUsername("replayd-user"))
                .thenReturn(Optional.of(user));

        PublicProfileResponse profile =
                profileService.getPublicProfile("replayd-user");

        assertTrue(profile.isPrivateProfile());
        assertTrue(profile.getGameLogs().isEmpty());
        verify(gameLogRepository, never()).findByUser(user);
    }

    private User createUser(boolean privateProfile) {
        User user = new User(
                "replayd-user",
                "user@example.com",
                "hashed-password",
                Role.USER
        );
        user.setId(42L);
        user.setPrivateProfile(privateProfile);
        return user;
    }

    private Game createGame() {
        Game game = new Game();
        game.setId(7L);
        game.setHomeTeam("Steelers");
        game.setAwayTeam("Ravens");
        game.setGameDate(Instant.parse("2026-09-10T00:00:00Z"));
        game.setSeason(2026);
        game.setWeek(1);
        game.setSport("NFL");
        return game;
    }

    private GameLog createGameLog(Game game, boolean privateReview) {
        GameLog gameLog = new GameLog(
                game,
                WatchType.FULL_GAME,
                5.0,
                privateReview ? "Private review" : "Public review"
        );
        gameLog.setId(privateReview ? 2L : 1L);
        gameLog.setPrivateReview(privateReview);
        return gameLog;
    }
}
