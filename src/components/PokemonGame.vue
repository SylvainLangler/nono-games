<template>
	<div>
		<div>
			<h3>Liste des joueurs</h3>
			<div v-for="(player,index) in players" :key="index">
				<span>{{ player }}</span>
				<span v-if="player === username"> (Moi)</span>
			</div>
			<button v-on:click="sendReadyGame()" v-show="!gameReady">Lancer la partie</button>
		</div>
		<div v-show="gameReady">
			<div>
				<h2>Ordre des joueurs</h2>
				<div v-for="(player, index) in players" :key="index">
					{{ index+1 }}: {{ player }}
				</div>
			</div>
			<div>Joueur actuel: {{ playing }}</div>
			<input type="text" name="pokemon" id="pokemon" v-model="pokemon">
			<button v-on:click="inputPokemonChange()">Valider</button>
			<div style="margin-top:50px; display:flex;"> 
				Liste des pokémons
				<div v-for="(pokemon, index) in pokemons" :key="index">
					{{ pokemon }}
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
			myTurn: false,
			playing: '',
		};
	}, 
	created() {
		
		if(localStorage.getItem('listePokemons') != ''){
			this.pokemons = localStorage.getItem('listePokemons');
		}
		else{
			// On récupère tous les pokémons
			for(let i = 1; i<150; i++){
				axios
				.get('https://pokeapi.co/api/v2/pokemon-species/'+i)
				.then(response => (this.pokemons.push(response.data.names[4].name)));
			}
		}
		localStorage.setItem('listePokemons', this.pokemons);

		console.log(localStorage.getItem('listePokemons'));
	},
	mounted() {

		this.socket.on('startGame', (player) => {
			this.gameReady = true;
			this.$emit('gameStarting', false);
			this.playing = player;
			if(this.username === this.playing){
				this.myTurn = true;
			}
		});

		this.socket.on('nextTurn', (indexNextPlayer) => {
			this.playing = this.players[indexNextPlayer];
			if(this.players[indexNextPlayer] === this.username){
				this.myTurn = true;
			}
		});
	},
	methods: {
		sendReadyGame(){
			this.socket.emit('startGame');
		},

		inputPokemonChange(){
			if(this.myTurn){
				if(this.pokemon === 'pikachu'){
					this.myTurn = false;
					this.socket.emit('turn', this.playing);
				}
			}
			else{
				alert("Ce n'est pas ton tour");
			}
		}
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
