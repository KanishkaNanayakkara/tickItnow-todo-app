package com.tickitnow.todo.service;

import java.util.List;

import com.tickitnow.todo.model.Task;

public interface TaskService {
    
    Task createTask(Task task);

    Task getTaskById(Long id);

    List<Task> getRecentTasks();

    void completeTask(Long id);

    Task updateTask(Long id, String title, String description);

}
