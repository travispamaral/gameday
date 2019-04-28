<template>
  <div class="game">
    <p><strong>{{ game['SUBJECT'] }}</strong></p>
    <p>Time: {{ game['START TIME'] }}</p>
  </div>
</template>

<script>
export default {
  name: 'Game',
  props: {
    game: {
      type: Object,
      default: () => {},
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.game {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 5px 15px rgba(254, 90, 29, .5);
}
</style>
