<template>
	<div>
		<div>
			<h3>Liste des joueurs</h3>
			<div v-for="(player,index) in players" :key="index">
				<span>{{ player[1] }}</span>
				<span v-if="player[1] === username"> (Moi)</span>
			</div>
		</div>
		<div>
			<input type="text" name="pokemon" id="pokemon" @change="updateInput()" v-model="pokemon">
		</div>
	</div>
</template>

<script>

export default {
	name: "PokemonGame",
	props:{
		username: String,
		players: Array,
		socket: Object
	},
	data() {
		return {
			pokemon: '',
		};
	}, 
	created() {
	},
	mounted() {
		this.socket.on('updatePokemon', (data) => {
			this.pokemon = data;
		});
	},
	methods: {
		updateInput(){
			this.socket.emit("inputPokemon", this.pokemon);
		}
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
