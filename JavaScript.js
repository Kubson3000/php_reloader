var messages_read = 0;
function post_message() {
    let username = document.getElementById('username').value;
    let message = document.getElementById('message').value;
    document.getElementById('message').value = '';
    let regex = '^[a-zA-Z0-9\s]{1,}$';
    if (username == '' || message == '') {
        alert("Missing username or message");
        return;
    }
    if (username.match(regex)) {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                //if (this.responseText != '') alert(this.responseText);
            }
        }
        xhttp.open("GET", "php/post_message.php?un=" + username + "&me=" + message);
        xhttp.send();
        update_message_client();
    }
    else {
        alert("Username or message contains illigal character, use [a-zA-Z0-9\\s]");
    }
}
function check_last_id() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText > messages_read) {
                update_message_client();
            }
        }
    }
    xhttp.open("GET", "php/get_last_id.php", true);
    xhttp.send();
}
function update_message_client() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var data = this.responseText;
            var a = data.split('/');
            for (var i = 0; i < a.length; i++) {
                if (a[i] == "") {
                    a.splice(i, 1);
                }
                else {
                    a[i] = a[i].split(';');
                }
            }
            var out = document.getElementById("message_area");
            for (var i = 0; i < a.length; i++) {
                out.innerHTML += '' + a[i][1] + ': ' + a[i][2] + '\n';
                messages_read++;
                out.scrollTop = out.scrollHeight;
            }
        }
    }
    xhttp.open("GET", "php/get_messages.php?rm=" + messages_read, true);
    xhttp.send();

}
function verify() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    if (username == null || username == "" || username.match("^[A-Za-z0-9_]{3,14}$") == null) {
        alert("Username error");
        return true;
    }
    if (password == null || password == "" || password.match("^[A-Za-z0-9_]{8,}$") == null) {
        alert("Password error");
        return true;
    }
    return false;
}
function login() {
    if (verify()) return;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert(this.responseText);
            if (this.responseText == "df") {
                alert("You dumb fuck!");
            }
            else {
                sessionStorage['token'] = this.responseText;
            }
        }
    }
    xhttp.open("POST", "php/login.php");
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("username="+username+"&password="+password);
}
function register() {
    if (verify()) return;
}
function main() {
    document.getElementById("message").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
          event.preventDefault();
          document.getElementById("post_button").click();
        }
      });
    setInterval(check_last_id, 1000);
}