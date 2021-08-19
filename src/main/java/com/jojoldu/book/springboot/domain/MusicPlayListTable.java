package com.jojoldu.book.springboot.domain;

import org.json.JSONObject;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.*;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.*;
import java.util.Properties;

@RestController
public class MusicPlayListTable {
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
    @PostMapping("/createTable")
    public static void CreateTable01(@RequestBody String listInput){

        Connection con = makeConnection();
        try {
            JSONObject uriJObject = new JSONObject(listInput);
            String tableName = uriJObject.getString("String");
            String query = "CREATE TABLE "+ tableName
                    +"( title varchar(100), video_link varchar(500), thumbnail_link varchar(500) )" ;

            PreparedStatement pstmt = con.prepareStatement(query);
            pstmt.executeUpdate();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

