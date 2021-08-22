package com.jojoldu.book.springboot.service.posts;

import com.jojoldu.book.springboot.domain.posts.MyMusicPlays;
import com.jojoldu.book.springboot.domain.posts.MyMusicPlaysRepository;
import com.jojoldu.book.springboot.web.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class MyMusicPlaysService {
    private final MyMusicPlaysRepository myMusicPlaysRepository;

    @Transactional
    public Long save(MyMusicPlaysSaveRequestDto requestDto) {
        return myMusicPlaysRepository.save(requestDto.toEntity()).getId();
    }

    @Transactional
    public Long update(Long id, MyMusicPlaysUpdateRequestDto requestDto) {
        MyMusicPlays myMusicPlays = myMusicPlaysRepository.findById(id).orElseThrow(() -> new
                IllegalArgumentException("해당 게시글이 없습니다. id="+ id));

        myMusicPlays.update(requestDto.getTitle());
        return id;
    }

    public MyMusicPlaysResponseDto findById (Long id) {
        MyMusicPlays entity = myMusicPlaysRepository.findById(id).orElseThrow(() -> new
                IllegalArgumentException("해당 게시글이 없습니다. id="+ id));
        return new MyMusicPlaysResponseDto(entity);
    }

    @Transactional(readOnly = true)
    public List<MyMusicPlaysListResponseDto> findAllDesc() {
        return myMusicPlaysRepository.findAllDesc().stream()
                .map(MyMusicPlaysListResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public void delete (Long id) {
        MyMusicPlays myMusicPlays = myMusicPlaysRepository.findById(id).orElseThrow(()->new IllegalArgumentException("해당 게시글이 없습니다. id="+ id));
        myMusicPlaysRepository.delete(myMusicPlays);
    }
}
