<?php
    $rm = $_GET['rm'];
    $conn = new mysqli('localhost', 'root', '', 'mp');
    $qry = 'select * from message_log where id > '.$rm;
    $data = $conn->query($qry);
    while($row = $data->fetch_assoc()) {
        echo $row['id'].'<;>'.$row['username'].'<;>'.$row['message'].'</>';
    }
?>