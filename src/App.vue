<template>
	<div id="app">
		<div class="inner">
			<div class="titre">
				Nono Games
			</div>
			<div v-show="!ready" class="inscription">
				<div class="label-pseudo">
					Entrez votre pseudo:
				</div>
				<div class="container-pseudo">
					<input
					class="input-pseudo"
					type="text"
					name="username"
					id="username"
					v-model="username"
					/>
					<button class="valider-pseudo" v-on:click="updateUsername(username)">Jouer</button>
				</div>
			</div>
			<PokemonGame
				:players="players"
				:username="username"
				:socket="socket"
				v-show="ready"
				@gameStarting="closeEntry"
			/>
		</div>
	</div>
</template>

<script>
import PokemonGame from "./components/PokemonGame.vue";
import io from "socket.io-client";

export default {
	name: "App",
	components: {
		PokemonGame,
	},
	data() {
		return {
			username: "",
			socket: {},
			players: [],
			ready: false,
			joinable: true,
		};
	},
	created() {
		// localhost:8101
		// sylvainlangler.alwaysdata.net
		this.socket = io("localhost:8101");
	},
	mounted() {
		this.socket.on("updatePlayers", (data) => {
			this.players = data;
			// S'il n'y a plus de joueurs -> on réouvre la room
			if (!this.players.length) {
				this.ready = false;
				this.joinable = true;
			}
		});

		this.socket.on("preventJoining", () => {
			this.ready = false;
			document.getElementById("username").disabled = true;
		});
	},
	methods: {
		updateUsername(username) {
			if (username != "" && this.joinable) {
				this.socket.emit("newPlayerUsername", {
					name: username,
				});
				this.ready = true;
				this.username = username;
			} else {
				if (document.getElementById("username").disabled === true) {
					alert("Une partie est déjà en cours");
				} else {
					alert("Veuillez entrer votre pseudo");
				}
			}
		},

		// pour les utilisateurs ayant la page du site ouverte, on passe la variable joinableà false
		closeEntry(value) {
			this.joinable = value;
		},
	},
};
</script>

<style>

@import url('<link href="https://fonts.googleapis.com/css2?family=Raleway:wght@500&display=swap" rel="stylesheet">');

@font-face {
 font-family: "Pokemon";
 src: url("/static/fonts/pokemon_hollow.woff") format("woff")
}

*{
	font-family: 'Raleway', sans-serif;
	margin: 0;
	padding: 0;
	box-sizing:border-box;
}

body{
	/* background: linear-gradient(180deg, rgba(71,164,157,1) 0%, rgba(176,255,229,1) 100%); */
	background-image: url("/static/background.png");
}

.inner{
	width:100%;
	height:100vh;
}

.titre{
	display: flex;
    justify-content: center;
    background-color: yellow;
    border-radius: 5px;
    margin: 50px auto 0 auto;
    padding: 20px;
    width: 260px;
    font-family: 'Pokemon';
    font-size: 38px;
    font-weight: bold;
    color: #0f314c;
}

.inscription{
	display:flex;
	flex-direction:column;
	align-items:center;
	margin: 130px auto;
	height: 200px;
    padding: 20px;
    justify-content: center;
    background-color: #0f314c;
    border: 3px solid #28567b;
    border-radius: 20px;
    width: 240px;
}

.label-pseudo{
	font-size:23px;
	color:#d6f4ff;
}

.container-pseudo{
	margin-top:35px;
	display:flex;
	justify-content: center;
	flex-wrap:wrap;
}

.input-pseudo{
	width:200px;
	height:40px;
	font-size:22px;
}

.valider-pseudo{
    width: 120px;
	padding: 10px;
    cursor: pointer;
    font-size: 22px;
    color: #d6f4ff;
    background-color: #28567b;
    border: 1px solid #28567b;
    border-radius: 5px;
	margin-top:15px;
	transition: .2s;
}

.valider-pseudo:hover{
	background-color: #ffff00;
	color:#28567b;
}

@media screen and (min-width: 500px){
	.titre{
		width:420px;
		font-size:42px;
	}
	.inscription{
		width:320px;
	}
}

@media screen and (min-width:768px){
	.titre{
		width:600px;
	}
	.inscription{
		width:450px;
	}
	.container-pseudo{
		flex-wrap:no-wrap;
	}
	.valider-pseudo{
		margin-left: 25px;
		margin-top:0;
		padding:0;
	}
}

@media screen and (min-width:1024px){
	.titre{
		font-size:55px;
		padding:15px;
	}
}

@media screen and (min-width:1750px){
	.inner{
		width:1750px;
		margin:0 auto;
	}
}

</style>
