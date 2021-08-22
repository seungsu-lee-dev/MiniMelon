package com.jojoldu.book.springboot.web.dto;


import com.jojoldu.book.springboot.domain.posts.MyMusicPlays;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class MyMusicPlaysListResponseDto {
    private Long id;
    private String title;


    public MyMusicPlaysListResponseDto(MyMusicPlays entity) {
        this.id = entity.getId();
        this.title = entity.getTitle();
    }
}