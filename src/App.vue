<template>
	<div id="app">
		<div class="inner">
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
		this.socket = io("sylvainlangler.alwaysdata.net");
	},
	mounted() {
		this.socket.on("updatePlayers", (data) => {
			this.players = data;
			// S'il n'y a plus de joueurs -> on réouvre la room
			if (!this.players.length) {
				this.ready = false;
				this.joinable = true;
			}
			if(this.ready === true && this.joinable === false && this.players.length === 1 && this.players[0] === this.username){
				alert('Gagné');
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

html, body{
	font-family: 'Raleway', sans-serif;
}

body{
	/* background: linear-gradient(180deg, rgba(71,164,157,1) 0%, rgba(176,255,229,1) 100%); */
	background: linear-gradient(180deg, rgba(33,51,83,1) 0%, rgba(8,13,14,1) 100%);
}

.inner{
	display:flex;
	justify-content: center;
	width:100%;
	height:100vh;
}

.inscription{
	display:flex;
	flex-direction:column;
	align-items:center;
	margin-top:100px;
	height: 200px;
    padding: 20px;
    justify-content: center;
    background-color: #0f314c;
    border: 3px solid #28567b;
    border-radius: 20px;
    width: 500px;
}

.label-pseudo{
	font-size:26px;
	color:#d6f4ff;
}

.container-pseudo{
	margin-top:30px;
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
	margin-left: 25px;
    width: 120px;
    cursor: pointer;
    font-size: 22px;
    color: #d6f4ff;
    background-color: #28567b;
    border: 1px solid #28567b;
    border-radius: 5px;
}

@media screen and (min-width:1024px){
	.inscription{
		margin-top:250px;
	}
}

@media screen and (min-width:1750px){
	.inner{
		width:1750px;
		margin:0 auto;
	}
}

</style>
