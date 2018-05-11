package com.hust.mem.model.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name="t_step")
public class Step {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int id;
    private int step;
    private String content;
    private int row;
    private int projectId;

}
