<template>
	<div>
		<div>
			Entrez votre pseudo:
		</div>
		<div>
			<input type="text" name="username" id="username" v-model="username">
			<button v-on:click="updateUsername(username)">Valider</button>
		</div>
	</div>
</template>

<script>

import io from "socket.io-client";

export default {
	name: "CreateUser",
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
		this.socket = io("sylvainlangler.alwaysdata.net");
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
