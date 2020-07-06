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
			<h3>Liste des pokémons</h3>
			<div style="margin-top:50px; display:flex; flex-wrap:wrap;"> 
				<div v-for="(pokemon, index) in pokemons" :key="index" style="width:80px; margin:5px; padding:2px;">
					<div style="text-align:center">{{ pokemon.name }}</div>
					<img :src="pokemon.img" style="width:100%;">
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

	},
	mounted() {

		this.getPokemons();

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

		compare(a, b) {
			const idA = a.id;
			const idB = b.id;

			let comparison = 0;
			if (idA > idB) {
				comparison = 1;
			} else if (idA < idB) {
				comparison = -1;
			}
			return comparison;
		},

		getPokemons(){
			// On récupère tous les pokémons
			let pokemons = localStorage.getItem('pokemons');
			if(!pokemons || pokemons === ''){
				pokemons = [];
				for(let i = 1; i<=151; i++){
					axios
					.get('https://pokeapi.co/api/v2/pokemon-species/'+i)
					.then(response => {
						let pokemonName = response.data.names[4].name;
						axios
						.get('https://pokeapi.co/api/v2/pokemon/'+i)
						.then(response2 => {
							let pokemonImg = response2.data.sprites.front_default;
							let pokemon = {id: i, name: pokemonName, img: pokemonImg}
							pokemons.push(pokemon);
							localStorage.setItem('pokemons', JSON.stringify(pokemons));	
							this.pokemons = JSON.parse(localStorage.getItem('pokemons'));
							this.pokemons.sort(this.compare);
						});
					});
				}
			}
			else{
				this.pokemons = JSON.parse(pokemons);
			}
		},

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
