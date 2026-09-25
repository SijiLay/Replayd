package com.replayd.controller;

import com.replayd.dto.GameLogRequest;
import com.replayd.model.GameLog;
import com.replayd.service.GameLogService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/game-logs")
public class GameLogController {

    private final GameLogService gameLogService;

    public GameLogController(GameLogService gameLogService) {
        this.gameLogService = gameLogService;
    }

    @GetMapping
    public List<GameLog> getAllGameLogs() {
        return gameLogService.getAllGameLogs();
    }

    @GetMapping("/{id}")
    public GameLog getGameLogById(@PathVariable Long id) {
        return gameLogService.getGameLogById(id);
    }

    @PostMapping
    public GameLog logGame(@Valid @RequestBody GameLogRequest request) {
        return gameLogService.logGame(
                request.getGameId(),
                request.getRating(),
                request.getReviewText()
        );
    }
}