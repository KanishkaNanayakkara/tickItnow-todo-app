package com.tickitnow.todo.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import com.tickitnow.todo.model.Task;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class TaskControllerIntegrationTest {

    @Value("${api.base-url}")
    private String baseUrl;

    @Value("${api.endpoint.tasks}")
    private String tasksEndpoint;

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    private String getRootUrl() {
        return baseUrl + port + tasksEndpoint;
    }

    @Test
    void createAndGetTask_ShouldSucceed() {
        Task task = new Task();
        task.setTitle("Integration Test Task");
        task.setDescription("Testing with real database");

        ResponseEntity<Task> postResponse = restTemplate.postForEntity(
            getRootUrl(), task, Task.class);

        assertThat(postResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        Task createdTask = postResponse.getBody();
        assertThat(createdTask).isNotNull();
        assertThat(Objects.requireNonNull(createdTask).getId()).isNotNull();
        assertThat(createdTask.getTitle()).isEqualTo(task.getTitle());

        ResponseEntity<Task[]> getResponse = restTemplate.getForEntity(
            getRootUrl(), Task[].class);

        assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        Task[] tasksArray = getResponse.getBody();
        assertThat(tasksArray).isNotNull();
        List<Task> tasks = Arrays.asList(tasksArray);
        assertThat(tasks).isNotEmpty();
        assertThat(tasks.stream()
            .anyMatch(t -> t.getTitle().equals(task.getTitle())))
            .isTrue();
    }

    @Test
    void completeTask_ShouldUpdateCompletionStatus() {
        Task task = new Task();
        task.setTitle("Task to Complete");
        task.setDescription("This task will be completed");

        ResponseEntity<Task> createResponse = restTemplate.postForEntity(
            getRootUrl(), task, Task.class);
        
        assertThat(createResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        Task createdTask = createResponse.getBody();
        assertThat(createdTask).isNotNull();
        
        Long taskId = Objects.requireNonNull(createdTask).getId();
        assertThat(taskId).isNotNull();

        // Complete the task
        ResponseEntity<Void> putResponse = restTemplate.exchange(
            getRootUrl() + "/" + taskId,
            HttpMethod.PUT,
            null,
            Void.class);

        assertThat(putResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        ResponseEntity<Task> getResponse = restTemplate.getForEntity(
            getRootUrl() + "/" + taskId, Task.class);

        // If GET by ID is not supported, fallback to getting all tasks
        if (getResponse.getStatusCode() == HttpStatus.NOT_FOUND || 
            getResponse.getStatusCode() == HttpStatus.METHOD_NOT_ALLOWED) {
            
            // Get all tasks and find the completed one
            ResponseEntity<Task[]> getAllResponse = restTemplate.getForEntity(
                getRootUrl(), Task[].class);
            
            assertThat(getAllResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
            Task[] tasksArray = getAllResponse.getBody();
            assertThat(tasksArray).isNotNull();
            
            Task completedTask = Arrays.stream(tasksArray)
                .filter(t -> taskId.equals(t.getId()))
                .findFirst()
                .orElse(null);
                
            assertThat(completedTask)
                .as("Task with ID %d should be found in the response. " +
                    "If not found, check if getRecentTasks() filters completed tasks.", taskId)
                .isNotNull();
                
            assertThat(completedTask.isCompleted())
                .as("Task with ID %d should be marked as completed", taskId)
                .isTrue();
        } else {
            Task completedTask = getResponse.getBody();
            assertThat(completedTask).isNotNull();
            assertThat(Objects.requireNonNull(completedTask).isCompleted())
                .as("Task with ID %d should be marked as completed", taskId)
                .isTrue();
        }
    }

    @Test
    void updateTask_ShouldModifyTitleAndDescription() {
        Task task = new Task();
        task.setTitle("Initial Title");
        task.setDescription("Initial Description");

        ResponseEntity<Task> createResponse = restTemplate.postForEntity(
            getRootUrl(), task, Task.class);
        
        assertThat(createResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        Task createdTask = createResponse.getBody();
        assertThat(createdTask).isNotNull();
        Long taskId = Objects.requireNonNull(createdTask).getId();
        assertThat(taskId).isNotNull();

        Task update = new Task();
        update.setTitle("Updated Title");
        update.setDescription("Updated Description");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Task> requestEntity = new HttpEntity<>(update, headers);

        ResponseEntity<Task> patchResponse = restTemplate.exchange(
            getRootUrl() + "/" + taskId,
            HttpMethod.PATCH,
            requestEntity,
            Task.class);

        assertThat(patchResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        Task updatedTask = patchResponse.getBody();
        assertThat(updatedTask).isNotNull();
        
        assertThat(Objects.requireNonNull(updatedTask).getTitle())
            .as("Updated task title should match")
            .isEqualTo("Updated Title");
        assertThat(updatedTask.getDescription())
            .as("Updated task description should match")
            .isEqualTo("Updated Description");
    }

    @Test
    void getRecentTasks_ShouldReturnAllTasks() {
        Task task1 = new Task();
        task1.setTitle("Task 1");
        task1.setDescription("First task");
        
        Task task2 = new Task();
        task2.setTitle("Task 2");
        task2.setDescription("Second task");

        ResponseEntity<Task> response1 = restTemplate.postForEntity(getRootUrl(), task1, Task.class);
        assertThat(response1.getStatusCode()).isEqualTo(HttpStatus.OK);
        Task createdTask1 = response1.getBody();
        assertThat(createdTask1)
            .as("First created task should not be null")
            .isNotNull();
        assertThat(Objects.requireNonNull(createdTask1).getId()).isNotNull();
        
        ResponseEntity<Task> response2 = restTemplate.postForEntity(getRootUrl(), task2, Task.class);
        assertThat(response2.getStatusCode()).isEqualTo(HttpStatus.OK);
        Task createdTask2 = response2.getBody();
        assertThat(createdTask2)
            .as("Second created task should not be null")
            .isNotNull();
        assertThat(Objects.requireNonNull(createdTask2).getId()).isNotNull();

        ResponseEntity<Task[]> getResponse = restTemplate.getForEntity(
            getRootUrl(), Task[].class);

        assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        Task[] tasksArray = getResponse.getBody();
        assertThat(tasksArray)
            .as("Response body should not be null")
            .isNotNull();
        
        List<Task> tasks = Arrays.asList(tasksArray);
        assertThat(tasks)
            .as("Should have at least two tasks")
            .hasSizeGreaterThanOrEqualTo(2);
        
        List<String> taskTitles = tasks.stream()
            .map(Task::getTitle)
            .toList();
            
        assertThat(taskTitles)
            .as("Response should contain both created tasks")
            .contains("Task 1", "Task 2");
    }
}