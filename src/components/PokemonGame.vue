<template>
	<div>
		<div>
			<h3>Liste des joueurs</h3>
			<div v-for="(player,index) in players" :key="index">
				{{ player[1] }}
			</div>
		</div>
	</div>
</template>

<script>

export default {
	name: "PokemonGame",
	props:{
		players: Array
	},
	data() {
		return {
			
		};
	}, 
	created() {
	},
	mounted() {
		console.log(this.players);
	},
	methods: {
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
