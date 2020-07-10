'use strict';
// クライアント側

// Socket.IOを利用してサーバに接続
const socket = io();
const canvas = document.getElementById('canvas-2d');
const context = canvas.getContext('2d');
const playerImage = $('#player-image')[0];
// プレイヤーの動きを保存
let movement = {};


function gameStart(){
    socket.emit('game-start');
    console.log('ゲームスタート')
}

$(document).on('keydown keyup', (event) => {
    const KeyToCommand = {
        'ArrowUp': 'forward',
        'ArrowDown': 'back',
        'ArrowLeft': 'left',
        'ArrowRight': 'right',
    };
    const command = KeyToCommand[event.key];
    if(command){
        if(event.type === 'keydown'){
            movement[command] = true;
        }else{ /* keyup */
            movement[command] = false;
        }
        socket.emit('movement', movement);
        console.log('動いたお')
    }
});

socket.on('state', (players) => {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.lineWidth = 10;
    context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height);
    context.stroke();

    Object.values(players).forEach((player) => {
        context.drawImage(playerImage, player.x, player.y);
        context.font = '20px Bold Arial';
        let id = player.id.toString()
        context.fillText('Player' + id, player.x, player.y - 20);
    });
});

socket.on('connect', gameStart);
socket.on("server_to_client", function(data){appendMsg(data.value)});

function appendMsg(text) {
    $("#chatLogs").append("<div>" + text + "</div>");
}

$("form").submit(function(e){
    var message = $("#msgForm").val();
    $("#msgForm").val('');
    socket.emit("client_to_server", {value : message});
    e.preventDefault();
});