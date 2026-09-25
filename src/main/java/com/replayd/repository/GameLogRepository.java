package com.replayd.repository;

import com.replayd.model.GameLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GameLogRepository extends JpaRepository<GameLog, Long> {

    Optional<GameLog> findByGameId(Long gameId);
}