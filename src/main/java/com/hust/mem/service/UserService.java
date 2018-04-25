package com.hust.mem.service;

import com.hust.mem.dao.UserRepository;
import com.hust.mem.enums.UserType;
import com.hust.mem.model.entity.User;
import com.hust.mem.model.json.UserInfo;
import com.hust.mem.util.PasswordHashUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

/**
 * @author fengqian
 * @since <pre>2018/04/25</pre>
 */
@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

    /**
     * 创建一个学生帐号
     * @param userInfo
     */
    public void createStudent(UserInfo userInfo) throws InvalidKeySpecException, NoSuchAlgorithmException {
        User user = new User();
        user.setUserType(UserType.STUDENT);
        user.setId(userInfo.getId());
        user.setName(userInfo.getName());
        user.setPassword(PasswordHashUtil.createHash(userInfo.getPassword()));
        userRepository.save(user);
    }
    /**
     * 创建一个教师帐号
     * @param userInfo
     */
    public void createTeacher(UserInfo userInfo) throws InvalidKeySpecException, NoSuchAlgorithmException {
        User user = new User();
        user.setUserType(UserType.TEACHER);
        user.setId(userInfo.getId());
        user.setName(userInfo.getName());
        user.setPassword(PasswordHashUtil.createHash(userInfo.getPassword()));
        userRepository.save(user);
    }
}
