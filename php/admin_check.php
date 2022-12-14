<?php
    if (isset($_POST['username'], $_POST['password'], $_POST['token'])) {
        $cred = array($_POST['username'], $_POST['password'], $_POST['token']);
        foreach ($cred as $crd) {
            if ($crd == NULL or $crd == '') {
                echo 'ic';
                exit;
            }
        }
        $conn = new mysqli('localhost', 'root', '', 'mp');
        $qry = 'select * from users where username="'.$cred[0].'" and password=PASSWORD("'.$cred[1].'") and token="'.$cred[2].'"';
        $res = $conn->query($qry);
        while($row = $res->fetch_assoc()) {
            if ($row['username'] == 'admin') {
                include '../adm/php/admin_panel.php';
            }
        }
    }
?>