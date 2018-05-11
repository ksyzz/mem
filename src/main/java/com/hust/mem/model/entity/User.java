package com.hust.mem.model.entity;

import com.hust.mem.enums.UserType;
import lombok.Data;

import javax.persistence.*;

/**
 * @author fengqian
 * @since <pre>2018/04/25</pre>
 */
@Data
@Entity
@Table(name = "t_user") // 只需要在数据库中创建一个表名为t_user的表，只需要添加一个id字段即可，其他的会自动补充
public class User {
    @Id
    private String id; // 学号
    private String password;
    private String name;
    @Enumerated(EnumType.STRING)
    private UserType userType;

}
