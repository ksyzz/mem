package com.hust.mem.controller;

import com.hust.mem.model.entity.Project;
import com.hust.mem.model.json.ProjectInfo;
import com.hust.mem.model.json.ProjectListInfo;
import com.hust.mem.model.json.UserInfo;
import com.hust.mem.service.ProjectService;
import com.hust.mem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.ArrayList;
import java.util.List;

/**
 * @author fengqian
 * @since <pre>2018/04/25</pre>
 */
@RestController
public class UserController {
    @Autowired
    UserService userService;

    @Autowired
    ProjectService projectService;

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
    @RequestMapping(value="/register/teacher", method= RequestMethod.POST)
    public void createTeacher(
        @RequestBody UserInfo userInfo
    ) throws InvalidKeySpecException, NoSuchAlgorithmException {
        userService.createTeacher(userInfo);
    }

    @RequestMapping(value = "/project",method = RequestMethod.POST)
    public void createProject(@RequestBody ProjectInfo projectInfo
            )throws InvalidKeySpecException, NoSuchAlgorithmException{
        projectService.createProject(projectInfo);
    }

    @GetMapping(value = "/project/{id}")
    @ResponseBody
    public ProjectInfo getProject(@PathVariable("id")Integer id){
        return projectService.getProjectInfo(id);
    }

    @GetMapping(value = "/projects")
    @ResponseBody
    public List<ProjectListInfo> projects(){
        List<ProjectListInfo> list = new ArrayList<>();
        for(Project project : projectService.getAllProjects()){
            list.add(projectService.getProjectListInfo(project.getId()));
        }
        return list;
    }

}
