package com.jojoldu.book.springboot.domain;

import com.jojoldu.book.springboot.web.MusicInfoController;
import com.jojoldu.book.springboot.web.dto.MusicInfoDto;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

@RestController
public class SelectPlayList {
    private static Logger logger = LoggerFactory.getLogger(MusicInfoController.class.getSimpleName());
    MusicInfoDto musicInfoDto = new MusicInfoDto();

    public static Connection makeConnection(){

        Connection con = null;
        String resource = "src/main/resources/application-db.properties";
        Properties properties = new Properties();
        String url = "";
        String id = "";
        String pw = "";

        try {
            FileInputStream fis = new FileInputStream(resource);
            properties.load(new java.io.BufferedInputStream(fis));

            url = properties.getProperty("spring.datasource.url");
            id = properties.getProperty("spring.datasource.username");
            pw = properties.getProperty("spring.datasource.password");

            Class.forName("com.mysql.cj.jdbc.Driver");
            System.out.println("드라이버 적재 성공");
            con = DriverManager.getConnection(url, id, pw);
            System.out.println("데이터베이스 연결 성공");
        }catch(ClassNotFoundException e) {

            System.out.println("드라이버를 찾을 수 없습니다.");
        }catch(SQLException e) {

            System.out.println("연결에 실패하였습니다.");
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return con;
    }

    @ResponseBody
    @PostMapping("/selectTable")
    public String SelectTable01(@RequestBody String selectlistInput) {
        Connection con = makeConnection();
        ResultSet rs = null;
        List<MusicInfoDto> musicPlayList = new ArrayList<MusicInfoDto>();
        try {
            JSONObject uriJObject = new JSONObject(selectlistInput);
            String tableName01 = uriJObject.getString("String");

            String query = "SELECT * FROM " + tableName01;
            PreparedStatement pstmt = con.prepareStatement(query);
            rs = pstmt.executeQuery();

            while (rs.next()) {
                String title = rs.getString("title");
                String video_link = rs.getString("video_link");
                String thumbnail_link = rs.getString("thumbnail_link");
                logger.info("title: " + title + ", video_link: " + video_link + ", thumbnail_link: " + thumbnail_link);

                musicInfoDto = new MusicInfoDto(thumbnail_link, video_link, title);
                logger.info(musicInfoDto.toString());

                musicPlayList.add(musicInfoDto);

            }



//            String query01 = "SELECT COUNT(*) FROM " + tableName01;
//            pstmt = con.prepareStatement(query01);
//            pstmt.executeUpdate();

        } catch (Exception e) {
            e.printStackTrace();
        }
        return musicPlayList.toString();
    }
}
