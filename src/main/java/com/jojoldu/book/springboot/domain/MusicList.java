package com.jojoldu.book.springboot.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.sql.Timestamp;

@Getter
@Setter
@ToString
@Entity
@Table(name="Autolists")
public class MusicList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bno;

    private String singer;
    private String title;

    @CreationTimestamp
    private Timestamp regdate;

    @UpdateTimestamp
    private  Timestamp updatedate;

}
