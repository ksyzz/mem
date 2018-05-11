package com.hust.mem.model.json;

import com.hust.mem.model.entity.Code;
import com.hust.mem.model.entity.Step;
import lombok.Data;

import java.util.List;
//创建project的json
@Data
public class ProjectInfo {
    private String name;
    private List<Code> codes;
    private List<Step> steps;
    private String userId;
}
