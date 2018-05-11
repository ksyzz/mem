package com.hust.mem.dao;

import com.hust.mem.model.entity.Code;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CodeRepository extends JpaRepository<Code,Integer> {
    List<Code> findByProjectId(int projectId);
}
