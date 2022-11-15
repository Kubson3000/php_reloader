<?php
    // expected variables $un $me
    $un = $_GET['un']; $me = $_GET['me'];
    $regex = '[A-z0-9\s]';
    if (/*preg_match($regex, $un) && preg_match($regex, $me)*/1) {
        $qry = 'insert into message_log(username, message) values ("'.$un.'","'.$me.'")';
        $conn = new mysqli('localhost', 'root', '', 'mp');
        $conn->query($qry);
        $qry = 'update last_id set id = id + 1';
        $conn->query($qry);
    }
?>