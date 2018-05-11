package com.hust.mem;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = MemApplication.class)
@Sql("/init.sql")
public class Test4396 {
    @Test()
    public void runInit(){

    }
}
