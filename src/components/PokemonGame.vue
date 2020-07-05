<template>
	<div>
		<div>
			<h3>Liste des joueurs</h3>
			<div v-for="(player,index) in players" :key="index">
				<span>{{ player[1] }}</span>
				<span v-if="player[1] === username"> (Moi)</span>
			</div>
			<button v-on:click="sendReadyGame()" v-show="!gameReady">Lancer la partie</button>
		</div>
		<div v-show="gameReady">
			<input type="text" name="pokemon" id="pokemon" @change="checkPokemon()" v-model="pokemon">
			<div>
				<h2>Ordre des joueurs</h2>
				<div v-for="(player, index) in order" :key="index">
					{{ index+1 }}: {{ player }}
				</div>
			</div>
			<div style="margin-top:50px; display:flex;"> 
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
			pokemons: [],
			pokemonsFound: [],
			gameReady: false,
			order: [],
		};
	}, 
	created() {
	},
	mounted() {
		// this.socket.on('updatePokemon', (data) => {
		// 	this.pokemon = data;
		// });

		// On récupère tous les pokémons
		axios
		.get('/static/pokemonjson/pokedex.json')
		.then(response => (this.pokemons = response.data));

		this.socket.on('startGame', () => {
			this.gameReady = true;
			this.$emit('gameStarting', false);
			this.choosePlayersOrder();
		});
	},
	methods: {
		// updateInput(){
		// 	this.socket.emit("inputPokemon", this.pokemon);
		// },
		sendReadyGame(){
			this.socket.emit('startGame');
		},

		// Fonction qui choisit un ordre aléatoire pour les joueurs
		// Potentiellement inutile
		choosePlayersOrder(){
			this.players.forEach(player => this.order.push(player[1]));
		}
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
