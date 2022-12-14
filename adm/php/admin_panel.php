<script>
    alert("Logged in as admin!")
    function restart_database() {
        if (verify()) return;
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                if (this.responseText == "ic") {
                    alert("Incorrect credentials!");
                }
                else if (this.responseText == "") {
                    alert("Database restarted!");
                }
                else alert("Error");
            }
        }
        xhttp.open("GET", "adm/php/initiate_database.php");
        xhttp.send();
    }
</script>
<button onclick="restart_database()">Restart database</button>