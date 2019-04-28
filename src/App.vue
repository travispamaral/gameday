<template>
  <div id="app">
    <img src="./assets/giants-logo.png">
    <div class="game-day">
      <Game
        v-if="todaysGame"
        :game="todaysGame" />
      <NoGame v-else />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import axios from 'axios'

import Game from '@/components/Game'
import NoGame from '@/components/NoGame'

export default {
  name: 'app',
  components: { Game, NoGame },

  data () {
    return {
      // games: require('@/assets/games.json'),
      games: {},
      today: moment().format('MM/DD/YY')
    }
  },

  computed: {
    todaysGame () {
      return this.games[this.today]
    }
  },

  created () {
    axios.get('games.json').then(res => {
      this.games = res.data
    })
  },

  methods: {

  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

img {
  width: 100%;
  max-width: 300px;
}

.game-day {
  margin: 4rem 0;
}
</style>
