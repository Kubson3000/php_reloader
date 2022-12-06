<?php
    $conn = new mysqli('localhost', 'root', '');
    $qry = 'drop database mp';
    $conn->query($qry);
    $qry = 'create database mp';
    $conn->query($qry);
    $qry = 'use mp';
    $conn->query($qry);
    $qry = 'create table message_log (
        id int not null auto_increment primary key,
        username text not null,
        message text not null
        )';
    $conn->query($qry);
    $qry = 'create table last_id (id int not null)';
    $conn->query($qry);
    $qry = 'insert into last_id values (0)';
    $conn->query($qry);
    $qry = 'create table users (
        id int not null auto_increment primary key,
        username varchar(16) not null,
        password varchar(255) not null,
        token varchar(255) not null
        )';
    $conn->query($qry);
    $qry = 'insert into users(username, password, token) values ("admin", password("password"), password("adminpassword"))';
    $conn->query($qry);
?>