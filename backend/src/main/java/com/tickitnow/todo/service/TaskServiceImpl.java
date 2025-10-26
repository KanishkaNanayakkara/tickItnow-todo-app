package com.tickitnow.todo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.tickitnow.todo.model.Task;
import com.tickitnow.todo.repository.TaskRepository;

@Service
public class TaskServiceImpl implements TaskService{
    private final TaskRepository taskRepository;

    public TaskServiceImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    @Override
    public List<Task> getRecentTasks() {
        return taskRepository.findTop5ByCompletedFalseOrderByCreatedAtDesc();
    }

    @Override
    public void completeTask(Long id) {
        Optional<Task> task = taskRepository.findById(id);
        task.ifPresent(t -> {
            t.setCompleted(true);
            taskRepository.save(t);
        });
    }

    @Override
    public Task updateTask(Long id, String title, String description) {
        Optional<Task> task = taskRepository.findById(id);
        return task.map(t -> {
            if (title != null) t.setTitle(title);
            if (description != null) t.setDescription(description);
            return taskRepository.save(t);
        }).orElseThrow(() -> new RuntimeException("Task not found"));
    }

    @Override
    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Task not found"));
    }
    
}
