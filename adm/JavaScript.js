function auth() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    console.log(username, password)
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("body").innerHTML += "<div id=\"admin_panel\"></div>";
            var panel = document.getElementById("admin_panel");
            panel.innerHTML = this.responseText;
        }
    }
    xhttp.open("POST", "php/auth.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("aun=" + username + "&aps=" + password);
}