package com.jojoldu.book.springboot.Web;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

@RestController
public class MusicSearchController {
    private static Logger logger = LoggerFactory.getLogger(MusicSearchController.class.getSimpleName());

    @ResponseBody
    @GetMapping("/musicPlay")
    public String searchMusic() {
        logger.info("MusicSearchController" + new Date());
//        Document doc = Jsoup.connect("");
        String gson = "";

        return "";
    }
}
