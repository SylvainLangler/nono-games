(function(e){function n(n){for(var o,s,i=n[0],u=n[1],l=n[2],p=0,m=[];p<i.length;p++)s=i[p],Object.prototype.hasOwnProperty.call(r,s)&&r[s]&&m.push(r[s][0]),r[s]=0;for(o in u)Object.prototype.hasOwnProperty.call(u,o)&&(e[o]=u[o]);c&&c(n);while(m.length)m.shift()();return a.push.apply(a,l||[]),t()}function t(){for(var e,n=0;n<a.length;n++){for(var t=a[n],o=!0,i=1;i<t.length;i++){var u=t[i];0!==r[u]&&(o=!1)}o&&(a.splice(n--,1),e=s(s.s=t[0]))}return e}var o={},r={app:0},a=[];function s(n){if(o[n])return o[n].exports;var t=o[n]={i:n,l:!1,exports:{}};return e[n].call(t.exports,t,t.exports,s),t.l=!0,t.exports}s.m=e,s.c=o,s.d=function(e,n,t){s.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},s.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,n){if(1&n&&(e=s(e)),8&n)return e;if(4&n&&"object"===typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(s.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)s.d(t,o,function(n){return e[n]}.bind(null,o));return t},s.n=function(e){var n=e&&e.__esModule?function(){return e["default"]}:function(){return e};return s.d(n,"a",n),n},s.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},s.p="/";var i=window["webpackJsonp"]=window["webpackJsonp"]||[],u=i.push.bind(i);i.push=n,i=i.slice();for(var l=0;l<i.length;l++)n(i[l]);var c=u;a.push([0,"chunk-vendors"]),t()})({0:function(e,n,t){e.exports=t("56d7")},1:function(e,n){},"56d7":function(e,n,t){"use strict";t.r(n);t("e260"),t("e6cf"),t("cca6"),t("a79d");var o=t("2b0e"),r=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{attrs:{id:"app"}},[t("div",{directives:[{name:"show",rawName:"v-show",value:!e.ready,expression:"!ready"}]},[t("div",[e._v(" Entrez votre pseudo: ")]),t("div",[t("input",{directives:[{name:"model",rawName:"v-model",value:e.username,expression:"username"}],attrs:{type:"text",name:"username",id:"username"},domProps:{value:e.username},on:{input:function(n){n.target.composing||(e.username=n.target.value)}}}),t("button",{on:{click:function(n){return e.updateUsername(e.username)}}},[e._v("Valider")])])]),t("PokemonGame",{directives:[{name:"show",rawName:"v-show",value:e.ready,expression:"ready"}],attrs:{players:e.players,username:e.username,socket:e.socket},on:{gameStarting:e.closeEntry}})],1)},a=[],s=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",[t("div",[t("h3",[e._v("Liste des joueurs")]),e._l(e.players,(function(n,o){return t("div",{key:o},[t("span",[e._v(e._s(n))]),n===e.username?t("span",[e._v(" (Moi)")]):e._e()])})),t("button",{directives:[{name:"show",rawName:"v-show",value:!e.gameReady,expression:"!gameReady"}],on:{click:function(n){return e.sendReadyGame()}}},[e._v("Lancer la partie")])],2),t("div",{directives:[{name:"show",rawName:"v-show",value:e.gameReady,expression:"gameReady"}]},[t("div",[t("h2",[e._v("Ordre des joueurs")]),e._l(e.players,(function(n,o){return t("div",{key:o},[e._v(" "+e._s(o+1)+": "+e._s(n)+" ")])}))],2),t("div",[e._v("Joueur actuel: "+e._s(e.playing))]),t("input",{directives:[{name:"model",rawName:"v-model",value:e.pokemon,expression:"pokemon"}],attrs:{type:"text",name:"pokemon",id:"pokemon"},domProps:{value:e.pokemon},on:{input:function(n){n.target.composing||(e.pokemon=n.target.value)}}}),t("button",{on:{click:function(n){return e.inputPokemonChange()}}},[e._v("Valider")]),t("div",{staticStyle:{"margin-top":"50px",display:"flex"}},[e._v(" Liste des pokémons "),e._l(e.pokemons,(function(n,o){return t("div",{key:o},[e._v(" "+e._s(n)+" ")])}))],2)])])},i=[],u=(t("b0c0"),t("bc3a")),l=t.n(u),c={name:"PokemonGame",props:{username:String,players:Array,socket:Object},data:function(){return{pokemon:"",pokemons:[],pokemonsFound:[],gameReady:!1,order:[],myTurn:!1,playing:""}},created:function(){var e=this;if(""!=localStorage.getItem("listePokemons"))this.pokemons=localStorage.getItem("listePokemons");else for(var n=1;n<150;n++)l.a.get("https://pokeapi.co/api/v2/pokemon-species/"+n).then((function(n){return e.pokemons.push(n.data.names[4].name)}));localStorage.setItem("listePokemons",this.pokemons),console.log(localStorage.getItem("listePokemons"))},mounted:function(){var e=this;this.socket.on("startGame",(function(n){e.gameReady=!0,e.$emit("gameStarting",!1),e.playing=n,e.username===e.playing&&(e.myTurn=!0)})),this.socket.on("nextTurn",(function(n){e.playing=e.players[n],e.players[n]===e.username&&(e.myTurn=!0)}))},methods:{sendReadyGame:function(){this.socket.emit("startGame")},inputPokemonChange:function(){this.myTurn?"pikachu"===this.pokemon&&(this.myTurn=!1,this.socket.emit("turn",this.playing)):alert("Ce n'est pas ton tour")}}},p=c,m=t("2877"),d=Object(m["a"])(p,s,i,!1,null,"74ef7c27",null),v=d.exports,f=t("8055"),y=t.n(f),h={name:"App",components:{PokemonGame:v},data:function(){return{username:"",socket:{},players:[],ready:!1,joinable:!0}},created:function(){this.socket=y()("localhost:8101")},mounted:function(){var e=this;this.socket.on("updatePlayers",(function(n){e.players=n,e.players.length||(e.ready=!1,e.joinable=!0)})),this.socket.on("preventJoining",(function(){e.ready=!1,document.getElementById("username").disabled=!0}))},methods:{updateUsername:function(e){""!=e&&this.joinable?(this.socket.emit("newPlayerUsername",{name:e}),this.ready=!0,this.username=e):!0===document.getElementById("username").disabled?alert("Une partie est déjà en cours"):alert("Veuillez entrer votre pseudo")},closeEntry:function(e){this.joinable=e}}},g=h,k=Object(m["a"])(g,r,a,!1,null,null,null),b=k.exports;o["a"].config.productionTip=!1,new o["a"]({render:function(e){return e(b)}}).$mount("#app")}});
//# sourceMappingURL=app.31322b57.js.map