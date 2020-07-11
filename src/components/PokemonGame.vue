<template>
	<div class="game">
		<div>
			<div class="infos">
				<div class="winner" v-show="winner">
					Gagnant: {{ winner }}
				</div>
			</div>
			<div class="joueurs" v-show="!winner">
				<h3>Liste des joueurs en lice</h3>
				<div v-for="(player,index) in players" :key="index">
					<span>{{ player }}</span>
					<span v-if="player === username"> (Moi)</span>
				</div>
			</div>
			<button v-on:click="sendReadyGame()" v-show="!gameReady">Lancer la partie</button>
		</div>
		<div v-show="gameReady">
			<div v-show="!winner">
				<div>
					<h2>Ordre des joueurs</h2>
					<div v-for="(player, index) in players" :key="index">
						{{ index+1 }}: {{ player }}
					</div>
				</div>
				<div>Joueur actuel: {{ playing }}</div>
				<div v-show="showTimer">{{ countDown }}</div>
				<input type="text" name="pokemon" id="pokemon" v-model="pokemon" @input="inputPokemonChange" autocomplete="off">
			</div>
		</div>
		<div class="pokemons-container" v-show="gameReady">
			<h3>Liste des pokémons trouvés</h3>
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
		socket: Object,
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
			winner: '',
			countDown: 15,
			showTimer: true
		};
	},
	mounted() {

		// On récupère la liste des pokémons
		this.getPokemons();

		// Lorsqu'on reçoit le signal du début de partie par le serveur
		this.socket.on('startGame', (player) => {
			this.gameReady = true;
			this.$emit('gameStarting', false);
			// On définit le premier joueur
			this.playing = player;
			// Si c'est soi-même, on indique que c'est notre tour
			if(this.username === this.playing){
				this.myTurn = true;
			}
			// On initialise le timer
			this.countDownTimer();
		});

		// Signal du serveur que le tour va passer au suivant
		this.socket.on('nextTurn', (indexNextPlayer) => {
			// S'il n'y a pas de gagnant
			if(this.winner === ''){
				console.log(this.players);
				// On met à jour le joueur courant
				this.playing = this.players[indexNextPlayer];
				// Si c'est soi-même, on l'indique
				if(this.players[indexNextPlayer] === this.username){
					this.myTurn = true;
				}

				// On remet le timer à zero et on arrête le settimeout
				this.countDown = 15;
				this.countDownTimer(stop);
			}
			else{
				// S'il y a un gagnant: on cache le timer
				this.showTimer = false;
			}
		});

		// Lorsque le serveur indique qu'un pokémon est trouvé
		this.socket.on('pokemonFound', (data) => {
			// On récupère la liste des pokémons trouvés mise à jour
			this.pokemonsFound = data.pokemonsFound;
			// Ainsi que la liste des pokémons restants
			this.pokemons = data.pokemons;
			// S'il n'y a plus aucun pokémon dans la liste 
			if(this.pokemons.length === 0){
				// Tout le monde gagne
				this.socket.emit('winnerUser', "Tout le monde");
			}
		});

		// Lorsque le serveur indique qu'un joueur a perdu
		this.socket.on('playerLost', (playerLost) => {
			// S'il ne reste plus qu'un joueurs, on arrête la partie
			if(this.players.length === 1){
				this.countDownTimer(stop);
				this.socket.emit('winnerUser', this.players[0]);
			}
			// Sinon
			else{
				// Si je suis la personne qui a perdu
				if(this.username === playerLost){
					// On arrête le timer
					this.countDownTimer(stop);
					this.showTimer = false;
				}
				// Sinon on continue la partie
				else{
					this.countDown = 15;
					this.countDownTimer();
				}
			}
		});

		// Si le serveur nous indique qu'il y a un gagnant
		this.socket.on('winner', (winner) => {
			// On affiche le gagnant
			// this.showTimer = false;
			this.winner = winner;
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

		// Fonction qui gère la liste des pokémons trouvables
		getPokemons(){
			// On récupère tous les pokémons
			let pokemons = localStorage.getItem('pokemons');
			if(!pokemons || pokemons === ''){
				pokemons = [];
				// pour la génération 1 (151 pokémons)
				for(let i = 1; i<=151; i++){
					// On récupère son nom
					axios
					.get('https://pokeapi.co/api/v2/pokemon-species/'+i)
					.then(response => {
						let pokemonName = response.data.names[4].name.replace(/[^\p{L}0-9-]/u, '');
						// Et son image
						axios
						.get('https://pokeapi.co/api/v2/pokemon/'+i)
						.then(response2 => {
							let pokemonImg = response2.data.sprites.front_default;
							// On met les 2 informations dans un objet
							let pokemon = {id: i, name: pokemonName, img: pokemonImg};
							// On push cet objet dans la liste des pokémons
							pokemons.push(pokemon);
							// On trie cette liste
							pokemons.sort(this.compare);
							// On stocke la liste des pokémons
							localStorage.setItem('pokemons', JSON.stringify(pokemons));	
							this.pokemons = JSON.parse(localStorage.getItem('pokemons'));
						});
					});
				}
			}
			// S'il ya déjà les pokémons dans le localstorage, on les récup
			else{
				this.pokemons = JSON.parse(pokemons);
			}
		},

		// Envoie le signal de début de partie
		sendReadyGame(){
			this.socket.emit('startGame');
		},

		// Lorsqu'un utilisateur entre une lettre dans l'input du pokémon
		inputPokemonChange(){
			// Si c'est son tour
			if(this.myTurn){
				// Si le mot entré correspond à un pokémon, on l'ajoute à la liste des poké trouvés par cet utilisateur à ce tour là
				let pokeFound = [];
				this.pokemons.forEach((poke) => {
					if(this.pokemon.toLowerCase() === poke.name.toLowerCase()){
						pokeFound.push(poke.id);
					}
				});
				// S'il en a trouvé
				if(pokeFound.length > 0){
					// On les valide et on passe le tour
					this.validatePokemons(pokeFound);
					this.myTurn = false;
					this.socket.emit('turn', this.playing);
					// On remet l'input à vide
					this.pokemon = '';
				}
			}
			else{
				alert("Ce n'est pas ton tour");
			}
		},

		// Fonction qui valide les pokémons trouvés dans le tableau donné
		validatePokemons(pokeFound){
			pokeFound.forEach((idPoke) => {
				// Pour chaque pokémon trouvé, on l'ajoute à notre liste
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

		// Timer... très compliqué, du mal à comprendre parfois
		// Paramètre stop, s'il y est on arrête le settimeout
		countDownTimer(stop) {
			let t;
			if(!stop){
				if(this.countDown > 0) {
					t = setTimeout(() => {
						this.countDown -= 1;
						this.countDownTimer();
					}, 1000);
				}
			}
			else{
				clearTimeout(t);
			}	
		}
	},
	watch: {
		// à chaque fois que le timer change
		countDown:function(time){
			// S'il arrive à 0 et que c'est à nous de jouer ET qu'il reste plus qu'un joueur -> on perd
			if(time === 0 && this.playing === this.username){
				if(this.players.length > 1){
					console.log("perdu");
					this.socket.emit('playerLost', this.playing);
				}
			}
		},
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
	.game{
		background-color: #0f314c;
		color:white;
		padding:30px;
		margin-top:50px;
		min-height:65vh;
	}
</style>
