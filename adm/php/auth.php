<?php
    if ((isset($_POST['aun'])) && isset($_POST['aps'])) {
        
        $aun = $_POST['aun']; $aps = $_POST['aps'];
        echo $aun.' '.$aps;
    }
    else {
        echo 'No username or password';
    }
?>