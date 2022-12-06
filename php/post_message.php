<?php
    if (isset($_POST['message']) && isset($_POST['token'])) {
        $message = $_POST['message'];
        $token = $_POST['token'];
        $conn = new mysqli('localhost', 'root', '', 'mp');
        $qry = 'select username from users where token = "'.$token.'"';
        $res = $conn->query($qry);
        while ($row = $res->fetch_array()) {
            $username = $row['username'];
            if ($username == '' || $username == NULL) exit();
            break;
        }
        $qry = 'insert into message_log(username, message) values ("'.$username.'", "'.$message.'")';
        $conn->query($qry);
        $qry = 'update last_id set id = (select max(id) from message_log)';
        $conn->query($qry);
    }
?>