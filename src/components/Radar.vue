<template>
  <div>
    <ul>
      <li v-for="blip in blips" v-bind:key="blip.title">{{blip.title}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    blips () {
      return this.$store.getters.loadedBlips
    }
  },
  data: () => ({
  })
}
</script>
