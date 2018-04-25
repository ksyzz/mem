package com.hust.mem.model.json;

/**
 * @author fengqian
 * @since <pre>2018/04/25</pre>
 */
public class UserInfo {
    private String id; // 学号
    private String name;
    private String password;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
