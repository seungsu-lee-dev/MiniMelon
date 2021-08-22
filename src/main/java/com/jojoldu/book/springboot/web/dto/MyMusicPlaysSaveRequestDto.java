package com.jojoldu.book.springboot.web.dto;


import com.jojoldu.book.springboot.domain.posts.MyMusicPlays;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class MyMusicPlaysSaveRequestDto {
    private String title;

    @Builder
    public MyMusicPlaysSaveRequestDto(String title) {
        this.title = title;
    }

    public MyMusicPlays toEntity() {
        return MyMusicPlays.builder()
                .title(title)
                .build();
    }

}
