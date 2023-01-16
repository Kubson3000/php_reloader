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
                alert(this.responseText);
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
    var coliders = [];
    var to_render = [];
    function get_random(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    function isColliding(obj1, obj2) {
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.height + obj1.y > obj2.y
    }
    function generate_coins() {
        var x = player.x; var y = player.y;
        var coins = 0;
        for (const x in coliders) {
            if (coliders[x].id == 1) {
                coins++;
            }
        }
        console.log("Found:",coins,"coins");
        var isColl = false;
        while (coins < 3) {
            isColl = false;
            x = get_random(0,250);
            y = get_random(0,250);
            for (const x in coliders) {
                if(isColliding(new Coin(x,y,""), coliders[x])) {
                    isColl = true;
                    break;
                }
            }
            if(!isColl) {
                var name = x.toString() + y.toString();
                var temp = new Coin(x,y,name);
                coliders.push(temp);
                to_render.push(temp);
                coins++;
            }
        }
    }
    class Border {
        x=0;y=0;width=0;height=0;id=0;
        constructor(x,y,w,h,id) {
            this.x = x;
            this.y = y;
            this.width = w;
            this.height = h;
        }
    };
    class Coin {
        x=0;y=0;width=10;height=10;#color="yellow";id=1;name="";
        constructor(x,y,n) {
            this.x = x;
            this.y = y;
            this.name = n;
        }
        draw() {
            ctx.fillStyle = this.#color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        destructor() {
            for (const x in coliders) {
                if (coliders[x].name == this.name) {
                    console.log("Removing:",coliders[x])
                    coliders.splice(x, 1);
                }
            }
            for (const x in to_render) {
                if (to_render[x].name == this.name) {
                    to_render.splice(x, 1);
                }
            }
            console.log(coliders, to_render)

        }
    };
    coliders.push(new Border(0,0,250,0));
    coliders.push(new Border(0,250,250,0));
    coliders.push(new Border(0,0,0,250));
    coliders.push(new Border(255,0,0,250));
    class Player {
        x = 0; y = 0;coins = 0; #height; #width; #color;
        constructor(x, y, h, w, c) {
            this.x = x;
            this.y = y;
            this.#height = h;
            this.#width = w;
            this.#color = c;
        }
        get_width() {
            return this.#width
        }
        get_height() {
            return this.#height
        }
        move(h_vec, w_vec) {
            if (!this.collsion_detection(h_vec, w_vec)) {
                this.x += h_vec;
                this.y += w_vec;
            }
        }
        draw() {
            ctx.fillStyle = this.#color;
            ctx.fillRect(this.x, this.y, this.#width, this.#height);
        }
        update_gui() {
            document.getElementById("coins_amount").innerHTML = this.coins;
        }
        collsion_detection(h_vec, w_vec) {
            for (const x in coliders) {
                if (this.is_coliding(coliders[x], h_vec, w_vec)) {
                    switch (coliders[x].id){
                        case 0: // wall
                            return true;   
                            break;
                        case 1: // coin
                            this.coins++;
                            coliders[x].destructor();
                            break;
                    }
                }
            }
            return false;
        }
        is_coliding(o, h_vec, w_vec) {
            return this.x+h_vec < o.x + o.width &&
             this.x+h_vec + this.#width > o.x &&
              this.y+w_vec < o.y + o.height &&
               this.#height + this.y+w_vec > o.y;
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
        ctx.fillRect(0, 0, 300, 300);
    }
    function renderer() {
        for (const x in to_render) {
            to_render[x].draw();
        }
    }
    function start() {
        player.draw();
        var arrows = ["1a","2a","3a","4a"];
        for (var i = 0; i < arrows.length; i++) {
            switch (i) {
                case 0:
                    document.getElementById(arrows[i]).addEventListener("click", function() {
                        player.move(0,-10);
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
        generate_coins();
        renderer();
        player.draw();
        player.update_gui();
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
