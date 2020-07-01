const Express = require("express")();
const Http = require("http").Server(Express);

const cors = require('cors');
const whitelist = ['http://localhost:8080', 'http://localhost:3000', 'http://sylvainlangler.alwaysdata.net'];
const corsOptions = {
	credentials: true, // This is important.
	origin: (origin, callback) => {
		if(whitelist.includes(origin))
		return callback(null, true)
		
		callback(new Error('Not allowed by CORS'));
  }
}

Express.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "http://localhost:8080");
	res.header('Access-Control-Allow-Credentials', true);
});
Express.use(cors(corsOptions));

const Socketio = require("socket.io")(Http);

// Liste des utilisateurs connectés
let connectedUserMap = new Map();

let joinable = true;

let players = [];

// à la connexion
Socketio.on('connection', function(socket){

	console.log("joinable"+ joinable);
	if(joinable){
		// On récupère l'id du socket
		let connectedUserId = socket.id;
	
		// On ajoute l'utilisateur à la map
		connectedUserMap.set(socket.id, { status:'online', name: '' });
		// On envoie un évent newPlayer au front avec l'utilisateur
		Socketio.emit("newPlayer", connectedUserMap.get(connectedUserId));
	
		// Si l'utilisateur entre un pseudo 
		socket.on('newPlayerUsername', function(data){
			// On met à jour son profil et on indique qu'il est bien considéré comme nouveau joueur
			let user = connectedUserMap.get(connectedUserId);
			user.name = data.name;
	
			// On ajoute le joueur
			players.push([socket.id, data.name]);
	
			// On indique au front qu'il y a une maj des joueurs
			Socketio.emit('updatePlayers', players);
		});
	}
	else{
		socket.emit("preventJoining");
	}

	// Si un joueur déco
	socket.on('disconnect', function(){
		// On supprime cet utilisateur de la map des utilisateurs
		connectedUserMap.delete(socket.id);
		// et des joueurs
		players = players.filter(player => player[0] != socket.id);
		// maj players
		Socketio.emit('updatePlayers', players);
	});

	// socket.on('inputPokemon', function(data){
	// 	Socketio.emit('updatePokemon', data);
	// });

	socket.on('startGame', function(){
		Socketio.emit('startGame');
		joinable = false;
		console.log(joinable);
	});
});


Http.listen(8101, () => {
	console.log("Listening at :8101...");
});
