package com.jojoldu.book.springboot.web.dto;


import com.jojoldu.book.springboot.domain.posts.MyMusicPlays;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class MyMusicPlaysResponseDto {
    private Long id;
    private String title;


    public MyMusicPlaysResponseDto(MyMusicPlays entity) {
        this.id = entity.getId();
        this.title = entity.getTitle();
    }
}