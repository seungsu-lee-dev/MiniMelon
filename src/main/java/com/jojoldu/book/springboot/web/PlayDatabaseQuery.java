package com.jojoldu.book.springboot.web;

import org.springframework.web.bind.annotation.GetMapping;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.Reader;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.*;
import java.util.Properties;

public class PlayDatabaseQuery {
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

    public static void INSERT02(String newListName, String videoTitle, String videoLink, String thumbnailLink, String second){

        Connection con = makeConnection();

        try {
            String query = "INSERT INTO "+ newListName +" (title, video_link, thumbnail_link, second) " +
                    "VALUES (?, ?, ?, ?)";

            //PreparedStatement로 쿼리 수행
            PreparedStatement pstmt = con.prepareStatement(query);
            pstmt.setString(1, videoTitle);
            pstmt.setString(2, videoLink);
            pstmt.setString(3, thumbnailLink);
            pstmt.setString(4, second);

            int ret = pstmt.executeUpdate();
            System.out.println(ret);

        } catch (SQLException throwables) {
            throwables.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
