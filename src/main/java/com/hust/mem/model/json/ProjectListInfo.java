package com.hust.mem.model.json;

import lombok.Data;

import java.util.Date;

//获取列表时的单个project的json
@Data
public class ProjectListInfo {
    private int id;
    private String name;
    private String creator;
    private Date created;
}
