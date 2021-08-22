package com.jojoldu.book.springboot.web;

import com.jojoldu.book.springboot.service.posts.MyMusicPlaysService;
import com.jojoldu.book.springboot.service.posts.PostsService;
import com.jojoldu.book.springboot.web.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
public class MyMusicPlaysApiController {
    private final MyMusicPlaysService myMusicPlaysService;

    @PostMapping("/api/v1/myMusicPlays")
    public Long save(@RequestBody MyMusicPlaysSaveRequestDto requestDto) {
        return myMusicPlaysService.save(requestDto);
    }

    @PutMapping("/api/v1/myMusicPlays/{id}")
    public Long update(@PathVariable Long id, @RequestBody MyMusicPlaysUpdateRequestDto requestDto) {
        return myMusicPlaysService.update(id, requestDto);
    }

    @GetMapping("/api/v1/myMusicPlays/{id}")
    public MyMusicPlaysResponseDto findById (@PathVariable Long id) {
        return myMusicPlaysService.findById(id);
    }

    @DeleteMapping("/api/v1/myMusicPlays/{id}")
    public Long delete(@PathVariable Long id) {
        myMusicPlaysService.delete(id);
        return id;
    }
}
