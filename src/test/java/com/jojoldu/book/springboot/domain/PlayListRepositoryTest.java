package com.jojoldu.book.springboot.domain;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.stream.Stream;

@RunWith(SpringRunner.class)
@SpringBootTest
public class PlayListRepositoryTest {
    @Autowired
    private PlayListRepository plRepo;

    @Test
    public void inspect() {
        //실제 객체의 클래스 이름
        Class<?> clz = plRepo.getClass();
        System.out.println(clz.getName());

        //클래스가 구현하고 있는 인터페이스 목록
        Class<?>[] interfaces = clz.getInterfaces();
        Stream.of(interfaces).forEach(inter -> System.out.println(inter.getName()));

        //클래스의 부모 클래스
        Class<?> superClasses = clz.getSuperclass();
        System.out.println(superClasses.getName());
    }

    //insert 작업
    @Test
    public void testInsert() {
        PlayList pl = new PlayList();
        pl.setSinger("장범준");
        pl.setTitle("노래방에서");

        plRepo.save(pl);
    }

    //select 작업
    @Test
    public void testRead() {
        plRepo.findById(1L).ifPresent((playList -> {
            System.out.println(playList);
        }));
    }

    //delete 작업
//    @Test
//    public void testDelete() {
//        System.out.println("DELETE Entity");
//        plRepo.deleteById(1L);
//    }
}

