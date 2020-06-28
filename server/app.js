const Express = require("express")();
const Http = require("http").Server(Express);

const cors = require('cors');
const whitelist = ['http://localhost:8080', 'http://localhost:3000', 'http://sylvainlangler.alwaysdata.net/nono-games/', 'http://sylvainlangler.alwaysdata.net/nono-games/server/'];
const corsOptions = {
  credentials: true, // This is important.
  origin: (origin, callback) => {
    if(whitelist.includes(origin))
      return callback(null, true)

      callback(new Error('Not allowed by CORS'));
  }
}

Express.use(cors(corsOptions));

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
