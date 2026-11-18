package com.replayd.service;

import com.replayd.dto.ProfileResponse;
import com.replayd.dto.PublicGameLogResponse;
import com.replayd.dto.PublicGameResponse;
import com.replayd.dto.PublicProfileResponse;
import com.replayd.exception.ProfileNotFoundException;
import com.replayd.model.GameLog;
import com.replayd.model.User;
import com.replayd.repository.GameLogRepository;
import com.replayd.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final GameLogRepository gameLogRepository;

    public ProfileService(
            UserRepository userRepository,
            GameLogRepository gameLogRepository
    ) {
        this.userRepository = userRepository;
        this.gameLogRepository = gameLogRepository;
    }

    public ProfileResponse getCurrentProfile() {
        return toProfileResponse(getCurrentUser());
    }

    public PublicProfileResponse getPublicProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ProfileNotFoundException(username));

        List<PublicGameLogResponse> gameLogs = user.isPrivateProfile()
                ? List.of()
                : gameLogRepository.findByUser(user).stream()
                        .map(this::toPublicGameLogResponse)
                        .toList();

        return new PublicProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getRole(),
                user.isPrivateProfile(),
                gameLogs
        );
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

    private PublicGameLogResponse toPublicGameLogResponse(GameLog gameLog) {
        boolean reviewIsPublic = !gameLog.isPrivateReview();
        return new PublicGameLogResponse(
                gameLog.getId(),
                new PublicGameResponse(
                        gameLog.getGame().getId(),
                        gameLog.getGame().getHomeTeam(),
                        gameLog.getGame().getAwayTeam(),
                        gameLog.getGame().getGameDate(),
                        gameLog.getGame().getSeason(),
                        gameLog.getGame().getWeek(),
                        gameLog.getGame().getSport(),
                        gameLog.getGame().getHomeScore(),
                        gameLog.getGame().getAwayScore(),
                        gameLog.getGame().getStatus(),
                        gameLog.getGame().getHomeTeamBadge(),
                        gameLog.getGame().getAwayTeamBadge()
                ),
                gameLog.getLoggedAt(),
                gameLog.getWatchType(),
                reviewIsPublic ? gameLog.getRating() : null,
                reviewIsPublic ? gameLog.getReviewText() : null
        );
    }
}