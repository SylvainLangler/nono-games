<template>
	<div id="app">
		<img alt="Vue logo" src="./assets/logo.png" />
		<button v-on:click="sendMessage('Hello world')">Send Message</button>
	</div>
</template>

<script>
export default {
	name: "App",
	data: function() {
		return {
			connection: null,
		};
	},
	methods: {
		sendMessage: function(message) {
			console.log(this.connection);
			this.connection.send(message);
		},
	},
	created: function() {
		console.log("Starting connection to websocket server");
		this.connection = new WebSocket("wss://echo.websocket.org");

		this.connection.onopen = function(event) {
			console.log(event);
			console.log("Successfully connected to the eco websocket server");
		};

		this.connection.onmessage = function(event) {
			console.log(event);
		};
	},
};
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
