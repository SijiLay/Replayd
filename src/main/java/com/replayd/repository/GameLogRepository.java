package com.replayd.repository;

import com.replayd.model.GameLog;
import com.replayd.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GameLogRepository extends JpaRepository<GameLog, Long> {

    Optional<GameLog> findByGameId(Long gameId);

    List<GameLog> findByUser(User user);

    Optional<GameLog> findByGameIdAndUser(Long gameId, User user);
}