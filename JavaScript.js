var messages_read = 0;
function post_message() {
    let message = document.getElementById('message').value;
    document.getElementById('message').value = '';
    let regex = '^[a-zA-Z0-9\s]{1,}$';
    if (message == '') {
        alert("Missing message");
        return;
    }
    if (sessionStorage['token'] == undefined) {
        alert("Not logged in!");
        return;
    }
    let token = sessionStorage['token'];
    if (message.match(regex)) {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                //if (this.responseText != '') alert(this.responseText);
            }
        }
        xhttp.open("POST", "php/post_message.php");
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("token=" + token + "&message=" + message);
        update_message_client();
    }
    else {
        alert("Message contains illigal character, use [a-zA-Z0-9\\s]");
        return;
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
            var a = data.split('</>');
            for (var i = 0; i < a.length; i++) {
                if (a[i] == "") {
                    a.splice(i, 1);
                }
                else {
                    a[i] = a[i].split('<;>');
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
function admin_chk() {
    if (verify()) return;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == "ic") {
                alert("Incorrect credentials!");
            }
            else {
                document.getElementById("admin_panel").innerHTML = this.responseText;
            }
        }
    }
    xhttp.open("POST", "php/admin_check.php");
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("username="+username+"&password="+password+"&token="+sessionStorage['token']);
}
function login() {
    if (verify()) return;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == "df") {
                alert("You dumb fuck!");
            }
            else if (this.responseText == "une") {
                alert("User doesn't exist!");
            }
            else if (this.responseText.length == 41) {
                sessionStorage['token'] = this.responseText;
                document.getElementById("logged_in").innerHTML = "Logged in as: " + username;
                admin_chk();
            }
            else {
                alert("Token error");
            }
        }
    }
    xhttp.open("POST", "php/login.php");
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("username="+username+"&password="+password);
}
function register() {
    if (verify()) return;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == "df") {
                alert("Username/password error!");
            }
            else if (this.responseText == 'ue') {
                alert("User already exists!")
            }
            else {
                sessionStorage['token'] = this.responseText;
                document.getElementById("logged_in").innerHTML = "Logged in as: " + username;
            }
        }
    }
    xhttp.open("POST", "php/register.php");
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("username="+username+"&password="+password);
}
function game_main() {
    let c = document.getElementById("game_canvas");
    let ctx = c.getContext("2d");
    class Player {
        x = 0; y = 0; #height; #width; #color;
        constructor(x, y, h, w, c) {
            this.x = x;
            this.y = y;
            this.#height = h;
            this.#width = w;
            this.#color = c;
        }
        move(h_vec, w_vec) {
            this.x += h_vec;
            this.y += w_vec;
        }
        draw() {
            ctx.fillStyle = this.#color;
            ctx.fillRect(this.x, this.y, this.#width, this.#height);
        }
    };
    const player = new Player(10, 10, 20, 20, "red");
    function draw_line(x1, y1, x2, y2) {
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    function clear() {
        ctx.fillStyle = "#F1F1F1";
        ctx.fillRect(0, 0, 300, 300)
    }
    function start() {
        player.draw();
        var arrows = ["1a","2a","3a","4a"];
        for (var i = 0; i < arrows.length; i++) {
            switch (i) {
                case 0:
                    document.getElementById(arrows[i]).addEventListener("click", function() {
                        player.move(0,-10);
                        console.log("up")
                    })
                    break;
                case 1:
                    document.getElementById(arrows[i]).addEventListener("click", function() {
                        player.move(-10,0);
                    })
                    break;
                case 2:
                    document.getElementById(arrows[i]).addEventListener("click", function() {
                        player.move(0, 10);
                    })
                    break;
                case 3:
                    document.getElementById(arrows[i]).addEventListener("click", function() {
                        player.move(10, 0);
                    })
                    break;
            }
        }

        setInterval(update, 100);
    }
    function update() {
        clear();
        player.draw();
    }
    start();
}
window.onload = function main() {
    sessionStorage.removeItem('token');
    let msg_box = document.getElementById("message");
    msg_box.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
          event.preventDefault();
          document.getElementById("post_button").click();
        }
        var msg = msg_box.value;
        console.log(msg.length);
        if (msg.length > 256) {
            msg_box.value = msg.slice(0 ,256);
        }
      });
    setInterval(check_last_id, 1000);
    game_main();
}
