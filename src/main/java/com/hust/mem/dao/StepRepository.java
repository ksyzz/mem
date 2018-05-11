package com.hust.mem.dao;

import com.hust.mem.model.entity.Step;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StepRepository extends JpaRepository<Step,Integer> {
    List<Step> findByProjectId(int projectId);
}
