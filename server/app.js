const Express = require("express")();
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http);

let position = {
	x: 200,
	y: 200,
};

Socketio.on("connection", (socket) => {
	socket.emit("position", position);

	socket.on("move", (data) => {
		switch (data) {
			case "left":
				position.x -= 5;
				// On appelle Socketio et non socket car Socketio va envoyer à tous les clients connectés
				Socketio.emit("position", position);
				break;
			case "right":
				position.x += 5;
				Socketio.emit("position", position);
				break;
			case "up":
				position.y -= 5;
				Socketio.emit("position", position);
				break;
			case "down":
				position.y += 5;
				Socketio.emit("position", position);
				break;
		}
	});
});

Http.listen(3000, () => {
	console.log("Listening at :3000...");
});
