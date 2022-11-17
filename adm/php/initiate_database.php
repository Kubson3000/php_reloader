<?php
    $conn = new mysqli('localhost', 'root', '');
    $qry = 'create database mp; use mp';
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
?>