package com.hust.mem.controller;

import com.hust.mem.model.json.UserInfo;
import com.hust.mem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

/**
 * @author fengqian
 * @since <pre>2018/04/25</pre>
 */
@RestController
public class UserController {
    @Autowired
    UserService userService;

    /**
     * 创建一个学员帐号
     * @param userInfo
     * @throws InvalidKeySpecException
     * @throws NoSuchAlgorithmException
     */
    @RequestMapping(value="/register/student", method= RequestMethod.POST)
    public void createStudent(
        @RequestBody UserInfo userInfo
    ) throws InvalidKeySpecException, NoSuchAlgorithmException {
        userService.createStudent(userInfo);
    }

    /**
     * 创建一个教师帐号
     * @param userInfo
     * @throws InvalidKeySpecException
     * @throws NoSuchAlgorithmException
     */
    @RequestMapping(value="/register/student", method= RequestMethod.POST)
    public void createTeacher(
        @RequestBody UserInfo userInfo
    ) throws InvalidKeySpecException, NoSuchAlgorithmException {
        userService.createTeacher(userInfo);
    }
}
