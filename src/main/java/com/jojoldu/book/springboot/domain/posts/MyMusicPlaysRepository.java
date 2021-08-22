package com.jojoldu.book.springboot.domain.posts;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MyMusicPlaysRepository extends JpaRepository <MyMusicPlays, Long> {
    @Query("SELECT m FROM MyMusicPlays m ORDER BY m.id DESC")
    List<MyMusicPlays> findAllDesc();
}
