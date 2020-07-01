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
			<div>
				Liste des pokémons
				<div v-for="(pokemon, index) in pokemons" :key="index">
					{{ pokemon.name.french }}
				</div>
			</div>
		</div>
	</div>
</template>

<script>

import axios from "axios";

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
			pokemons: null,
		};
	}, 
	created() {
	},
	mounted() {
		this.socket.on('updatePokemon', (data) => {
			this.pokemon = data;
		});

		axios
		.get('/static/pokemonjson/pokedex.json')
		.then(response => (this.pokemons = response.data));
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
