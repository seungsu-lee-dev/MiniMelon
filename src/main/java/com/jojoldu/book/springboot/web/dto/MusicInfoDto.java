package com.jojoldu.book.springboot.web.dto;

public class MusicInfoDto {
    String thumbnailLink;
    String videoLink;
    String videoTitle;

    public MusicInfoDto() {

    }

    public String getThumbnailLink() {
        return thumbnailLink;
    }

    public void setThumbnailLink(String thumbnailLink) {
        this.thumbnailLink = thumbnailLink;
    }

    public String getVideoLink() {
        return videoLink;
    }

    public void setVideoLink(String videoLink) {
        this.videoLink = videoLink;
    }

    public String getVideoTitle() {
        return videoTitle;
    }

    public void setVideoTitle(String videoTitle) {
        this.videoTitle = videoTitle;
    }

    public MusicInfoDto(String thumbnailLink, String videoLink, String videoTitle) {
        super();
        this.thumbnailLink = thumbnailLink;
        this.videoLink = videoLink;
        this.videoTitle = videoTitle;
    }

    @Override
    public String toString() {
        return "{" +
                "\"thumbnailLink\": " + "\"" + thumbnailLink + "\"" +
                ", \"videoLink\": " + "\"" + videoLink + "\"" +
                ", \"videoTitle\": " + "\"" + videoTitle + "\"" +
                "}";
    }
}
