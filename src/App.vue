<template>
	<div id="app">
		<div v-show="!ready">
			<div>
				Entrez votre pseudo:
			</div>
			<div>
				<input type="text" name="username" id="username" v-model="username">
				<button v-on:click="updateUsername(username)">Valider</button>
			</div>
		</div>
		<PokemonGame :players="players" :username="username" :socket="socket" v-show="ready" @gameStarting="closeEntry"/>
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
			username: '',
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
		this.socket.on('updatePlayers', (data) => {
			this.players = data;
			// S'il n'y a plus de joueurs -> on réouvre la room
			if(!this.players.length){
				this.ready = false;
				this.joinable = true;
			}
		});

		this.socket.on('preventJoining', () => {
			this.ready = false;
			document.getElementById('username').disabled = true;
		})
	},
	methods: {
		updateUsername(username){
			if(username != '' && this.joinable){
				this.socket.emit('newPlayerUsername', {
					name: username
				});
				this.ready = true;
				this.username = username;
			}
			else{
				if(!(this.joinable)){
					alert('Une partie est déjà en cours');
				}
				else{
					alert('Veuillez entrer votre pseudo');
				}
			}
		},

		// pour les utilisateurs ayant la page du site ouverte, on passe la variable joinableà false
		closeEntry(value){
			this.joinable = value;
		}
	},

};
</script>

<style></style>
