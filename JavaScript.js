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
function main() {
    setInterval(check_last_id, 1000);
}