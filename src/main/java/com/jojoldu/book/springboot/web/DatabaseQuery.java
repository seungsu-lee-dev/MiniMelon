package com.jojoldu.book.springboot.web;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.*;

public class DatabaseQuery {
    public static Connection makeConnection(){

        Connection con = null;
        String url = "jdbc:mysql://code-and-talk-mini-melondb.cyy4xompg0g1.ap-northeast-2.rds.amazonaws.com:3306/cat_team?autoReconnect=true";
        String id = "catadmin";
        String pw = "smartfarm";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            System.out.println("드라이버 적재 성공");
            con = DriverManager.getConnection(url, id, pw);
            System.out.println("데이터베이스 연결 성공");
        }catch(ClassNotFoundException e) {

            System.out.println("드라이버를 찾을 수 없습니다.");
        }catch(SQLException e) {

            System.out.println("연결에 실패하였습니다.");
        }
        return con;
    }

    public static void INSERT(){

        String title = "test_title2";
        String video_link = "test_video_link2";
        String thumbnail_link = "test_thumbnail_link2";

        Connection con = makeConnection();

        try {
            String query = "INSERT INTO testlist (title, video_link, thumbnail_link) " +
                    "VALUES (?, ?, ?)";

            //PreparedStatement로 쿼리 수행
            PreparedStatement pstmt = con.prepareStatement(query);
            pstmt.setString(1, title);
            pstmt.setString(2, video_link);
            pstmt.setString(3, thumbnail_link);

            int ret = pstmt.executeUpdate();
            System.out.println(ret);

        } catch (SQLException throwables) {
            throwables.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
