package com.jojoldu.book.springboot.Web;

import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
public class MusicSearchController {
    private static Logger logger = LoggerFactory.getLogger(MusicSearchController.class.getSimpleName());

    @ResponseBody
    @PostMapping("/musicPlay")
    public String searchMusic(@RequestBody String jsonUri) {
        logger.info("MusicSearchController" + new Date());

        logger.info(jsonUri);
        JSONObject jObject = new JSONObject(jsonUri);
        String uri = jObject.getString("uri");
        logger.info(uri);

//        Document doc = Jsoup.connect("");
        
        return "";
    }
}
