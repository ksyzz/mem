package com.hust.mem.model.entity;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name="t_code")
@Data
public class Code {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int id;
    private int row;
    private String code;
    private int projectId;

}
