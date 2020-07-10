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
			<div>{{ countDown }}</div>
			<input type="text" name="pokemon" id="pokemon" v-model="pokemon" @input="inputPokemonChange" autocomplete="off">
			<h3>Liste des pokémons</h3>
			<div style="margin-top:50px; display:flex; flex-wrap:wrap;" class="pokemons"> 
				<div v-for="(pokemon, index) in pokemonsFound" :key="index" :id="'poke'+pokemon.id" style="width:80px; margin:5px; padding:2px;">
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
			countDown: 15,
		};
	},
	mounted() {

		// On récupère la liste des pokémons
		this.getPokemons();

		// Lorsqu'on reçoit le signal du début de partie par le serveur
		this.socket.on('startGame', (player) => {
			this.gameReady = true;
			this.$emit('gameStarting', false);
			this.playing = player;
			if(this.username === this.playing){
				this.myTurn = true;
			}
			this.countDownTimer();
		});

		// Signal du serveur que le tour va passer au suivant
		this.socket.on('nextTurn', (indexNextPlayer) => {
			this.playing = this.players[indexNextPlayer];
			if(this.players[indexNextPlayer] === this.username){
				this.myTurn = true;
			}
			this.countDown = 15;
			this.countDownTimer(stop);
		});

		// Lorsque le serveur indique qu'un pokémon est trouvé
		this.socket.on('pokemonFound', (data) => {
			this.pokemonsFound = data.pokemonsFound;
			this.pokemons = data.pokemons;
			if(this.pokemons.length === 0){
				alert('Bravo, vous avez tous gagné !');
			}
		});

	},
	methods: {

		// Fonction récupérée, utilisée lors du array.sort pour trier les pokémons dans l'ordre
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
						let pokemonName = response.data.names[4].name.replace(/[^\p{L}0-9-]/u, '');
						axios
						.get('https://pokeapi.co/api/v2/pokemon/'+i)
						.then(response2 => {
							let pokemonImg = response2.data.sprites.front_default;
							let pokemon = {id: i, name: pokemonName, img: pokemonImg}
							pokemons.push(pokemon);
							pokemons.sort(this.compare);
							localStorage.setItem('pokemons', JSON.stringify(pokemons));	
							this.pokemons = JSON.parse(localStorage.getItem('pokemons'));
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
				let pokeFound = [];
				this.pokemons.forEach((poke) => {
					if(this.pokemon.toLowerCase() === poke.name.toLowerCase()){
						pokeFound.push(poke.id);
					}
				});
				if(pokeFound.length > 0){
					this.validatePokemons(pokeFound);
					this.myTurn = false;
					this.socket.emit('turn', this.playing);
					this.pokemon = '';
				}
			}
			else{
				alert("Ce n'est pas ton tour");
			}
		},

		validatePokemons(pokeFound){
			pokeFound.forEach((idPoke) => {
				// Pour chaque pokémon trouvé dans la liste des pokés, on l'affiche ou quoi
				this.pokemons.forEach((pokemon) => {
					if(pokemon.id === idPoke){
						this.pokemonsFound.push(pokemon);
						// On retire le pokemon trouvé de la liste des pokémons trouvables
						this.removePokemon(idPoke);
						this.socket.emit('pokemonFound', {pokemonId: pokemon.id, pokemonsFound : this.pokemonsFound, pokemons: this.pokemons});
					}
				});
			});
		},

		// Fonction qui supprime un pokémon de la liste des pokémons trouvable en fonction de son id
		removePokemon(id){
			// Pour chaque pokémon dans la liste des trouvables
			this.pokemons.forEach((pokemon, index) => {
				// Si on trouve le pokémon dans la liste
				if(pokemon.id === id){
					this.pokemons.splice(index, 1);
				}
			});
		},

		countDownTimer(stop) {
			let t
			if(!stop){
				if(this.countDown > 0) {
						t = setTimeout(() => {
							this.countDown -= 1;
							this.countDownTimer();
						}, 1000);
				}
				else{
					clearTimeout(t);
				}
			}
			else{
				clearTimeout(t);
			}	
		}
	},
	watch: {
		countDown:function(time){
			if(time === 0 && this.playing === this.username){
				alert('Perdu');
				this.socket.emit('playerLost', this.playing);
			}
		},

	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
