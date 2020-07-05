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
			players.push(data.name);
	
			// On indique au front qu'il y a une maj des joueurs
			Socketio.emit('updatePlayers', players);
		});
	}
	else{
		socket.emit("preventJoining");
	}

	// Si un joueur déco
	socket.on('disconnect', function(){
		// On supprime le joueur de la liste des joueurs
		players = players.filter(player => player != connectedUserMap.get(socket.id).name);
		// On supprime cet utilisateur de la map des utilisateurs
		connectedUserMap.delete(socket.id);
		// maj players
		Socketio.emit('updatePlayers', players);
		// S'il n'y a plus de joueurs -> on réouvre la room
		if(!players.length){
			joinable = true;
		}
	});

	socket.on('startGame', function(){
		Socketio.emit('startGame', players[0]);
		joinable = false;
	});

	socket.on('turn', function(player){
		let indexPlayer = players.indexOf(player);
		let indexNextPlayer = getNextPlayer(indexPlayer);
		Socketio.emit('nextTurn', indexNextPlayer);
	});
});

function getNextPlayer(indexPlayer){
	// 2 joueurs, players.length = 1, index du dernier joueur = 1
	// Si l'index du joueur courant est le dernier (c'est à dire = players.length)
	if(indexPlayer === players.length-1){
		return 0;
	}
	else{
		return indexPlayer+1;
	}
}


Http.listen(8101, () => {
	console.log("Listening at :8101...");
});
