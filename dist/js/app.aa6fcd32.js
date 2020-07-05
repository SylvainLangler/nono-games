(function(e){function n(n){for(var r,s,i=n[0],u=n[1],c=n[2],d=0,p=[];d<i.length;d++)s=i[d],Object.prototype.hasOwnProperty.call(o,s)&&o[s]&&p.push(o[s][0]),o[s]=0;for(r in u)Object.prototype.hasOwnProperty.call(u,r)&&(e[r]=u[r]);l&&l(n);while(p.length)p.shift()();return a.push.apply(a,c||[]),t()}function t(){for(var e,n=0;n<a.length;n++){for(var t=a[n],r=!0,i=1;i<t.length;i++){var u=t[i];0!==o[u]&&(r=!1)}r&&(a.splice(n--,1),e=s(s.s=t[0]))}return e}var r={},o={app:0},a=[];function s(n){if(r[n])return r[n].exports;var t=r[n]={i:n,l:!1,exports:{}};return e[n].call(t.exports,t,t.exports,s),t.l=!0,t.exports}s.m=e,s.c=r,s.d=function(e,n,t){s.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},s.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,n){if(1&n&&(e=s(e)),8&n)return e;if(4&n&&"object"===typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(s.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)s.d(t,r,function(n){return e[n]}.bind(null,r));return t},s.n=function(e){var n=e&&e.__esModule?function(){return e["default"]}:function(){return e};return s.d(n,"a",n),n},s.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},s.p="/";var i=window["webpackJsonp"]=window["webpackJsonp"]||[],u=i.push.bind(i);i.push=n,i=i.slice();for(var c=0;c<i.length;c++)n(i[c]);var l=u;a.push([0,"chunk-vendors"]),t()})({0:function(e,n,t){e.exports=t("56d7")},1:function(e,n){},"56d7":function(e,n,t){"use strict";t.r(n);t("e260"),t("e6cf"),t("cca6"),t("a79d");var r=t("2b0e"),o=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{attrs:{id:"app"}},[t("div",{directives:[{name:"show",rawName:"v-show",value:!e.ready,expression:"!ready"}]},[t("div",[e._v(" Entrez votre pseudo: ")]),t("div",[t("input",{directives:[{name:"model",rawName:"v-model",value:e.username,expression:"username"}],attrs:{type:"text",name:"username",id:"username"},domProps:{value:e.username},on:{input:function(n){n.target.composing||(e.username=n.target.value)}}}),t("button",{on:{click:function(n){return e.updateUsername(e.username)}}},[e._v("Valider")])])]),t("PokemonGame",{directives:[{name:"show",rawName:"v-show",value:e.ready,expression:"ready"}],attrs:{players:e.players,username:e.username,socket:e.socket},on:{gameStarting:e.closeEntry}})],1)},a=[],s=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",[t("div",[t("h3",[e._v("Liste des joueurs")]),e._l(e.players,(function(n,r){return t("div",{key:r},[t("span",[e._v(e._s(n[1]))]),n[1]===e.username?t("span",[e._v(" (Moi)")]):e._e()])})),t("button",{directives:[{name:"show",rawName:"v-show",value:!e.gameReady,expression:"!gameReady"}],on:{click:function(n){return e.sendReadyGame()}}},[e._v("Lancer la partie")])],2),t("div",{directives:[{name:"show",rawName:"v-show",value:e.gameReady,expression:"gameReady"}]},[t("input",{directives:[{name:"model",rawName:"v-model",value:e.pokemon,expression:"pokemon"}],attrs:{type:"text",name:"pokemon",id:"pokemon"},domProps:{value:e.pokemon},on:{change:function(n){return e.checkPokemon()},input:function(n){n.target.composing||(e.pokemon=n.target.value)}}}),t("div",[t("h2",[e._v("Ordre des joueurs")]),e._l(e.order,(function(n,r){return t("div",{key:r},[e._v(" "+e._s(r+1)+": "+e._s(n)+" ")])}))],2),t("div",{staticStyle:{"margin-top":"50px",display:"flex"}},[e._v(" Liste des pokémons "),e._l(e.pokemons,(function(n,r){return t("div",{key:r},[e._v(" "+e._s(n.name.french)+" ")])}))],2)])])},i=[],u=(t("4160"),t("159b"),t("bc3a")),c=t.n(u),l={name:"PokemonGame",props:{username:String,players:Array,socket:Object},data:function(){return{pokemon:"",pokemons:[],pokemonsFound:[],gameReady:!1,order:[]}},created:function(){},mounted:function(){var e=this;c.a.get("/static/pokemonjson/pokedex.json").then((function(n){return e.pokemons=n.data})),this.socket.on("startGame",(function(){e.gameReady=!0,e.$emit("gameStarting",!1),e.choosePlayersOrder()}))},methods:{sendReadyGame:function(){this.socket.emit("startGame")},choosePlayersOrder:function(){var e=this;this.players.forEach((function(n){return e.order.push(n[1])}))}}},d=l,p=t("2877"),m=Object(p["a"])(d,s,i,!1,null,"6a712d9b",null),v=m.exports,f=t("8055"),y=t.n(f),h={name:"App",components:{PokemonGame:v},data:function(){return{username:"",socket:{},players:[],ready:!1,joinable:!0}},created:function(){this.socket=y()("sylvainlangler.alwaysdata.net")},mounted:function(){var e=this;this.socket.on("updatePlayers",(function(n){e.players=n,e.players.length||(e.ready=!1,e.joinable=!0)})),this.socket.on("preventJoining",(function(){e.ready=!1,document.getElementById("username").disabled=!0}))},methods:{updateUsername:function(e){""!=e&&this.joinable?(this.socket.emit("newPlayerUsername",{name:e}),this.ready=!0,this.username=e):this.joinable?alert("Veuillez entrer votre pseudo"):alert("Une partie est déjà en cours")},closeEntry:function(e){this.joinable=e}}},k=h,g=Object(p["a"])(k,o,a,!1,null,null,null),b=g.exports;r["a"].config.productionTip=!1,new r["a"]({render:function(e){return e(b)}}).$mount("#app")}});
//# sourceMappingURL=app.aa6fcd32.js.map