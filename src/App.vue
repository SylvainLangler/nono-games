<template>
	<div id="app">
		<div>
			Entrez votre pseudo:
		</div>
		<div>
			<input type="text" name="username" id="username" v-model="username">
			<button v-on:click="updateUsername(username)">Valider</button>
		</div>
		<PokemonGame />
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
			console.log(this.players);
		})
	},
	methods: {
		updateUsername(username){
			this.socket.emit('newPlayerUsername', {
				name: username
			});
		}
	},

};
</script>

<style></style>
