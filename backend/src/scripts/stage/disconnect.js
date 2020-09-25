// disconnect

const utils = require('../utils');

class Disconnect {

    constructor() {}

    static do(io, socket, roomManager, reason) {
        let room = roomManager.findRoomBySocket(socket);
        if (room != null) {
            socket.leave(room.name);
            const player = roomManager.findPlayer(socket);
            player.disconnect();
            room.game.field.cards.filter(card => card.player === socket.id)
                .forEach(card => card.player = player.name);
        }
        // game.deletePlayer(socket.id);
        // let game = roomManager.findRoomBySocket(socket).game;
        // console.log(game);
        // utils.logWithStage(game.stage, 'Delete [' + socket.id + ']');
        // console.log(reason);
        // io.to(socket.id).emit('connect');
        // io.sockets.emit('update_number_of_player', {num : game.players.length});
    }
}

module.exports = Disconnect;