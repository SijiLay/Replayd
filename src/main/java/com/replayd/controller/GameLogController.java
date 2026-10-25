package com.replayd.controller;

import com.replayd.dto.GameLogRequest;
import com.replayd.model.GameLog;
import com.replayd.service.GameLogService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
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

    @GetMapping("/game/{gameId}")
    public ResponseEntity<GameLog> getGameLogByGameId(@PathVariable Long gameId) {
        GameLog gameLog = gameLogService.getGameLogByGameId(gameId);

        if (gameLog == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(gameLog);
    }

    @PostMapping
    public GameLog logGame(@Valid @RequestBody GameLogRequest request) {
        return gameLogService.logGame(
                request.getGameId(),
                request.getWatchType(),
                request.getRating(),
                request.getReviewText()
        );
    }
}