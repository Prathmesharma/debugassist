package com.debugassist.repository;

import com.debugassist.entity.Analysis;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnalysisRepository extends JpaRepository<Analysis, Long> {
    List<Analysis> findAllByOrderByCreatedAtDesc();
}
