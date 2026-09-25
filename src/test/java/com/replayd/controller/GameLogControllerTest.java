package com.replayd.controller;

import tools.jackson.databind.ObjectMapper;
import com.replayd.dto.GameLogRequest;
import com.replayd.service.GameLogService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(GameLogController.class)
public class GameLogControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private GameLogService gameLogService;

    @Test
    void ratingAboveFiveReturnsBadRequest() throws Exception {

        GameLogRequest request = new GameLogRequest();
        request.setGameId(1L);
        request.setRating(6);
        request.setReviewText("Test review");

        mockMvc.perform(
                        post("/game-logs")
                                .contentType("application/json")
                                .content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isBadRequest());
    }

    @Test
    void ratingBelowOneReturnsBadRequest() throws Exception {

        GameLogRequest request = new GameLogRequest();
        request.setGameId(1L);
        request.setRating(0);

        mockMvc.perform(
                        post("/game-logs")
                                .contentType("application/json")
                                .content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isBadRequest());
    }
}