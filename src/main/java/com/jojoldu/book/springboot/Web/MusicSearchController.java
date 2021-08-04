package com.jojoldu.book.springboot.Web;

import org.json.JSONArray;
import org.json.JSONObject;
import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Date;

@RestController
public class MusicSearchController {
    private static Logger logger = LoggerFactory.getLogger(MusicSearchController.class.getSimpleName());

    @ResponseBody
    @PostMapping("/musicPlay")
    public String searchMusic(@RequestBody String jsonUri) {
        try {
            logger.info("MusicSearchController " + new Date());
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

//            Connection.Response response = Jsoup.connect(uri)
//                    .userAgent()

//            JSONObject musicJObject = new JSONObject(doc);
//            JSONArray musicArr = musicJObject.getJSONArray("contents");
//            logger.info(String.valueOf(musicArr));

            String docStr = String.valueOf(doc);
            int nonceValueIndex = docStr.indexOf("<script nonce=")+"<script nonce=".length();
            String nonceValue = docStr.substring(nonceValueIndex, docStr.substring(nonceValueIndex).indexOf(">")+nonceValueIndex);
            logger.info(nonceValue);
            int index = docStr.indexOf("<script nonce="+nonceValue+">var ytInitialData = ") + nonceValue.length() + "<script nonce=>var ytInitialData = ".length();
            String result = docStr.substring(index, docStr.substring(index).indexOf(";</script>")+index);
//            logger.info(result);

            JSONObject musicJObject = new JSONObject(result);
            JSONArray content2 = musicJObject.getJSONObject("contents").getJSONObject("twoColumnSearchResultsRenderer").getJSONObject("primaryContents").getJSONObject("sectionListRenderer").getJSONArray("contents").getJSONObject(0).getJSONObject("itemSectionRenderer").getJSONArray("contents");
//            logger.info(content2.toString());

            // 영상 정보(썸네일 주소, 영상 주소, 영상 제목)
            JSONObject musicData = content2.getJSONObject(0).getJSONObject("videoRenderer");
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
            String finalVideoTitle = videoTitle.substring(0, videoTitle.indexOf("게시자")-1);
            logger.info(finalVideoTitle);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return "";
    }
}
