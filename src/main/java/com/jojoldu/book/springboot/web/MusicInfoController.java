package com.jojoldu.book.springboot.web;

import com.jojoldu.book.springboot.service.posts.PostsService;
import com.jojoldu.book.springboot.web.dto.MusicInfoDto;
import com.jojoldu.book.springboot.web.dto.PostsSaveRequestDto;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
public class MusicInfoController {
    private static Logger logger = LoggerFactory.getLogger(MusicInfoController.class.getSimpleName());
    MusicInfoDto musicInfoDto = new MusicInfoDto();
    List<MusicInfoDto> searchMusicList = new ArrayList<MusicInfoDto>();
    List<MusicInfoDto> MusicListsave = new ArrayList<MusicInfoDto>();


    @ResponseBody
    @PostMapping("/musicPlay")
    public String searchMusic(@RequestBody String jsonUri) {
        try {
            logger.info("MusicInfoController " + new Date());
            logger.info(jsonUri);
            JSONObject uriJObject = new JSONObject(jsonUri);
            String uri = uriJObject.getString("uri");
            logger.info(uri);

            Document doc = Jsoup.connect(uri).get();
//            Document doc = Jsoup.connect(uri).post();

//            logger.info(String.valueOf(doc));

//            Elements videoLinks = doc.select(".yt-simple-endpoint.inline-block.style-scope.ytd-thumbnail");
//            int num = videoLinks.size();
//            logger.info("영상 개수: "+num);
//            if (num!=0) {
//                logger.info(videoLinks.get(0).text());
//            }

//            JSONObject musicJObject = new JSONObject(doc);
//            JSONArray musicArr = musicJObject.getJSONArray("contents");
//            logger.info(String.valueOf(musicArr));

            String docStr = String.valueOf(doc);
            int nonceValueIndex = docStr.indexOf("<script nonce=") + "<script nonce=".length();
            String nonceValue = docStr.substring(nonceValueIndex, docStr.substring(nonceValueIndex).indexOf(">") + nonceValueIndex);
            logger.info(nonceValue);
            int index = docStr.indexOf("<script nonce=" + nonceValue + ">var ytInitialData = ") + nonceValue.length() + "<script nonce=>var ytInitialData = ".length();
            String result = docStr.substring(index, docStr.substring(index).indexOf(";</script>") + index);
//            logger.info(result);

            JSONObject musicJObject = new JSONObject(result);
            JSONArray content2 = musicJObject.getJSONObject("contents").getJSONObject("twoColumnSearchResultsRenderer").getJSONObject("primaryContents").getJSONObject("sectionListRenderer").getJSONArray("contents").getJSONObject(0).getJSONObject("itemSectionRenderer").getJSONArray("contents");
//            logger.info(content2.toString());

            searchMusicList = new ArrayList<MusicInfoDto>();
            for (int i = 0; i < content2.length(); i++) {
                // 영상 정보(썸네일 주소, 영상 주소, 영상 제목)
                JSONObject musicData;
                try {
                    musicData = content2.getJSONObject(i).getJSONObject("videoRenderer");
                } catch (Exception e) {
                    continue;
                }
//            logger.info(String.valueOf(musicData));
                // 썸네일 주소
                String thumbnailLink = musicData.getJSONObject("thumbnail").getJSONArray("thumbnails").getJSONObject(0).getString("url");
                logger.info(thumbnailLink);
                // 영상 주소
                String videoLink = musicData.getString("videoId");
                logger.info(videoLink);
                // 영상 제목
                String videoTitle = musicData.getJSONObject("title").getJSONObject("accessibility").getJSONObject("accessibilityData").getString("label");
//            logger.info(videoTitle);
                videoTitle = videoTitle.replaceAll("\"", "");
                String finalVideoTitle = videoTitle.substring(0, videoTitle.indexOf("게시자") - 1);
                logger.info(finalVideoTitle);

                musicInfoDto = new MusicInfoDto(thumbnailLink, videoLink, finalVideoTitle);
                logger.info(musicInfoDto.toString());

                searchMusicList.add(musicInfoDto);
            }
            logger.info("searchMusicList 길이: " + searchMusicList.size());

        } catch (IOException e) {
            e.printStackTrace();
        }
//        return musicInfoDto.toString();
        return searchMusicList.toString();
    }

    @ResponseBody
    @PostMapping("/musicPlaysave")
    public String musicplaysave(@RequestBody String jsonData) {

        logger.info("logo!! :" + jsonData);
        JSONObject dataJObject = new JSONObject(jsonData);
        String thumbnailUri = dataJObject.getString("thumbnailLink");
        String title = dataJObject.getString("videoTitle");
        String videoUri = dataJObject.getString("videoLink");
        logger.info("logo!! :" + thumbnailUri);
        logger.info("logo!! :" + title);
        logger.info("logo!! :" + videoUri);


        DatabaseQuery insert = new DatabaseQuery();
        insert.INSERT(title, videoUri, thumbnailUri);
        return jsonData;
    }

//    @ResponseBody
//    @PostMapping("/autoPlaysave")
//    public String autoplaysave(@RequestBody String jsonData) {
//        logger.info("logo!!!!!!!!!!!!! :" + jsonData);
//        return jsonData;
//    }


}


