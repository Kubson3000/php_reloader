<?php
	$conn = new mysqli('localhost', 'root', '', 'mp');
	$qry = 'select * from last_id';
	$data = $conn->query($qry);
	while ($row = $data->fetch_assoc()) {
		echo $row['id'];
		break;
	}
?>