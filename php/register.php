<?php
if (isset($_POST['username']) && isset($_POST['password'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];
    if ($username == NULL || $username == "" || preg_match('/^[A-Za-z0-9_]{3,14}$/', $username) == FALSE) {
        echo 'df';
        exit();
    }
    if ($password == NULL || $password == "" || preg_match('/^[A-Za-z0-9_]{8,}$/', $password) == FALSE) {
        echo 'df';
        exit();
    }
    $conn = new mysqli('localhost', 'root', '', 'mp');
    $qry = 'select * from users where username ="'.$username.'"';
    $res = $conn->query($qry);
    while ($row = $res->fetch_assoc()) {
        echo 'ue';
        exit();
    }
    $qry = 'insert into users(username, password, token) values ("'.$username.'", password("'.$password.'"), password("'.$username.$password.'"))';
    $conn->query($qry);
    $qry = 'select token from users where username="'.$username.'" and password=password("'.$password.'")';
    $res = $conn->query($qry);
    while ($row = $res->fetch_assoc()) {
        echo $row['token'];
        exit();
    }
}
?>