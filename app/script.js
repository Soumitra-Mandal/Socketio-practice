var socket = io();
const log = console.log;
var messages = document.getElementById("messages");
var form = document.getElementById("form");
var input = document.getElementById("input");
var nameButton = document.getElementById("name-button");
var modal = document.getElementById("myModal");
var body = document.getElementsByTagName("body")[0];
var span = document.getElementsByClassName("close")[0];
var nickName = document.getElementById("nick");
var typing = document.getElementById("typing");
var connection = document.getElementById("connection");
let userName;

function makeid(length) {
  var result = "";
  var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function handleName() {
  userName = nickName.value.length > 0 ? nickName.value : makeid(5);
  modal.style.display = "none";
  socket.emit("conn", userName);
}

nickName.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    nameButton.click();
  }
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    var msg = userName + ": " + input.value;
    socket.emit("chat message", msg);
    var item = document.createElement("li");
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
    input.value = "";
  }
});

socket.on("chat message", function (msg) {
  var item = document.createElement("li");
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

body.onload = function () {
  modal.style.display = "block";
};

span.onclick = function () {
  userName = makeid(5);
  modal.style.display = "none";
  socket.emit("conn", userName);
};

window.onclick = function (event) {
  if (event.target == modal) {
    userName = makeid(5);
    modal.style.display = "none";
    socket.emit("conn", userName);
  }
};

input.addEventListener("keypress", function (e) {
  socket.emit("typing", userName);
});

socket.on("typing", function (name) {
  typing.textContent = name + " is typing...";
  setTimeout(() => {
    typing.textContent = "";
  }, 1000);
});

socket.on("conn", function (name) {
  connection.textContent = name + " is connected!";
});
