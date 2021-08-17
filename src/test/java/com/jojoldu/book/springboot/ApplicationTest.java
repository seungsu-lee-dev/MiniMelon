package com.jojoldu.book.springboot;

import com.jojoldu.book.springboot.domain.AutoList;
import com.jojoldu.book.springboot.domain.AutoListRepository;
import com.jojoldu.book.springboot.domain.PlayList;
import com.jojoldu.book.springboot.domain.PlayListRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ApplicationTest {
    @Autowired
    private AutoListRepository repo;

    @Test
    public void contextLoads() {

    }

}