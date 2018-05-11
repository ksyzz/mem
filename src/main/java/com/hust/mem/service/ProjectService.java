package com.hust.mem.service;

import com.hust.mem.dao.CodeRepository;
import com.hust.mem.dao.ProjectRepository;
import com.hust.mem.dao.StepRepository;
import com.hust.mem.dao.UserRepository;
import com.hust.mem.model.entity.Code;
import com.hust.mem.model.entity.Project;
import com.hust.mem.model.entity.Step;
import com.hust.mem.model.entity.User;
import com.hust.mem.model.json.ProjectInfo;
import com.hust.mem.model.json.ProjectListInfo;
import com.hust.mem.model.json.UserInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.Date;
import java.util.List;

@Service
public class ProjectService {
    @Autowired
    ProjectRepository projectRepository;

    @Autowired
    CodeRepository codeRepository;

    @Autowired
    StepRepository stepRepository;

    @Autowired
    UserRepository userRepository;

    public void createProject(ProjectInfo projectInfo) throws InvalidKeySpecException, NoSuchAlgorithmException {
        Project project = new Project();
        project.setName(projectInfo.getName());
        project.setUserId(projectInfo.getUserId());
        project.setCreated(new Date());
        List<Code> codes = projectInfo.getCodes();
        List<Step> steps = projectInfo.getSteps();
        projectRepository.save(project);
        for(Code code : codes){
            code.setProjectId(project.getId());
            codeRepository.save(code);
        }
        for(Step step : steps){
            step.setProjectId(project.getId());
            stepRepository.save(step);
        }
    }


    //这个是列表展示用的Info
    public ProjectListInfo getProjectListInfo(int id){
        Project project = projectRepository.getOne(id);
        ProjectListInfo projectListInfo = new ProjectListInfo();
        projectListInfo.setId(project.getId());
        projectListInfo.setName(project.getName());
        projectListInfo.setCreator(userRepository.getOne(project.getUserId()).getName());
        projectListInfo.setCreated(project.getCreated());
        return projectListInfo;
    }

    //这个是查一个project时用的Info
    public ProjectInfo getProjectInfo(int id){
        ProjectInfo projectInfo = new ProjectInfo();
        Project project = projectRepository.getOne(id);
        projectInfo.setName(project.getName());
        projectInfo.setUserId(project.getUserId());
        List<Code> codes = codeRepository.findByProjectId(project.getId());
        List<Step> steps = stepRepository.findByProjectId(project.getId());
        projectInfo.setCodes(codes);
        projectInfo.setSteps(steps);
        return projectInfo;
    }

    public List<Project> getAllProjects(){
        return projectRepository.findAll();
    }
}
