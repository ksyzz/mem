package com.hust.mem.dao;

import com.hust.mem.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author fengqian
 * @since <pre>2018/04/25</pre>
 * spring data jpa
 */
@Repository
public interface UserRepository extends JpaRepository<User, String> {
}
