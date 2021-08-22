package com.jojoldu.book.springboot.domain;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.stream.Stream;

@RunWith(SpringRunner.class)
@SpringBootTest
public class MusicListRepositoryTest {
    @Autowired
    private MusicListRepository MuRepo;

    @Test
    public void inspect() {
        //실제 객체의 클래스 이름
        Class<?> clz = MuRepo.getClass();
        System.out.println(clz.getName());

        //클래스가 구현하고 있는 인터페이스 목록
        Class<?>[] interfaces = clz.getInterfaces();
        Stream.of(interfaces).forEach(inter -> System.out.println(inter.getName()));

        //클래스의 부모 클래스
        Class<?> superClasses = clz.getSuperclass();
        System.out.println(superClasses.getName());
    }

    @Test
    public void testInsert() {
        MusicList ml = new MusicList();
        ml.setSinger("가수");
        ml.setTitle("제목");

        MuRepo.save(ml);
    }

    @Test
    public void testRead() {
        MuRepo.findById(1L).ifPresent((musicList -> {System.out.println(musicList);}));
    }

//    @Test
//    public void testDelete() {
//        System.out.println("DELETE Entity");
//        MuRepo.deleteById(1L);
//    }


}
