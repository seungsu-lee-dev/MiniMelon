package com.jojoldu.book.springboot.web.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class MyMusicPlaysUpdateRequestDto {
    private String title;


    @Builder
    public MyMusicPlaysUpdateRequestDto(String title) {
        this.title = title;
    }
}
