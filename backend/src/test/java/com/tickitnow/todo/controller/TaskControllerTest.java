package com.tickitnow.todo.controller;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tickitnow.todo.Controller.TaskController;
import com.tickitnow.todo.model.Task;
import com.tickitnow.todo.service.TaskService;

@WebMvcTest(TaskController.class)
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @SuppressWarnings("removal")
    @MockBean
    private TaskService taskService;

    @Test
    void createTask_shouldReturnCreatedTask() throws Exception {
        Task input = new Task();
        input.setTitle("Test Task");
        input.setDescription("Desc");

        Task returned = new Task();
        returned.setId(1L);
        returned.setTitle(input.getTitle());
        returned.setDescription(input.getDescription());
        returned.setCreatedAt(LocalDateTime.now());

        when(taskService.createTask(any(Task.class))).thenReturn(returned);

        mockMvc.perform(post("/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Test Task"))
                .andExpect(jsonPath("$.description").value("Desc"));
    }

    @Test
    void getRecentTasks_shouldReturnList() throws Exception {
        Task t1 = new Task();
        t1.setId(1L);
        t1.setTitle("A");
        t1.setDescription("d1");

        Task t2 = new Task();
        t2.setId(2L);
        t2.setTitle("B");
        t2.setDescription("d2");

        List<Task> tasks = Arrays.asList(t1, t2);
        when(taskService.getRecentTasks()).thenReturn(tasks);

        mockMvc.perform(get("/tasks").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[1].id").value(2));
    }

    @Test
    void completeTask_shouldCallService_andReturnOk() throws Exception {
        Long id = 5L;
        doNothing().when(taskService).completeTask(id);

        mockMvc.perform(put("/tasks/{id}", id))
                .andExpect(status().isOk());

        verify(taskService).completeTask(id);
    }

    @Test
    void updateTask_shouldReturnUpdatedTask() throws Exception {
        Long id = 3L;
        Task update = new Task();
        update.setTitle("Updated title");
        update.setDescription("Updated desc");

        Task returned = new Task();
        returned.setId(id);
        returned.setTitle(update.getTitle());
        returned.setDescription(update.getDescription());

        when(taskService.updateTask(id, update.getTitle(), update.getDescription())).thenReturn(returned);

        mockMvc.perform(patch("/tasks/{id}", id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(3))
                .andExpect(jsonPath("$.title").value("Updated title"))
                .andExpect(jsonPath("$.description").value("Updated desc"));
    }
}
