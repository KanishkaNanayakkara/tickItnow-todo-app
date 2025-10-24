package com.tickitnow.todo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tickitnow.todo.model.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findTop5ByCompletedFalseOrderByCreatedAtDesc();
    
}
