package com.hust.mem.model.entity;

import com.hust.mem.enums.UserType;

import javax.persistence.*;

/**
 * @author fengqian
 * @since <pre>2018/04/25</pre>
 */
@Entity
@Table(name = "t_user") // 只需要在数据库中创建一个表名为t_user的表，只需要添加一个id字段即可，其他的会自动补充
public class User {
    @Id
    private String id; // 学号
    private String password;
    private String name;
    @Enumerated(EnumType.STRING)
    private UserType userType;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public UserType getUserType() {
        return userType;
    }

    public void setUserType(UserType userType) {
        this.userType = userType;
    }
}
