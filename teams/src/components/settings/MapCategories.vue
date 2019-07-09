<template>
  <v-container>
    <v-combobox
      v-model="cat1"
      label="Choose the master category for quadrant 1"
      :items="categories"
    ></v-combobox>
    <v-combobox
      v-model="cat2"
      label="Choose the master category for quadrant 2"
      :items="categories"
    ></v-combobox>
    <v-combobox
      v-model="cat3"
      label="Choose the master category for quadrant 3"
      :items="categories"
    ></v-combobox>
    <v-combobox
      v-model="cat4"
      label="Choose the master category for quadrant 4"
      :items="categories"
    ></v-combobox>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    cat1: null,
    cat2: null,
    cat3: null,
    cat4: null
  }),
  computed: {
    devs () {
      return this.$store.getters.devs
    },
    team () {
      return this.$store.getters.team || { filename: 'N/A', title: 'Upload team competence radar on the right ➡️' }
    },
    categories () {
      return this.devs.concat(this.team)
        .map(e => e.payload.meta.categories)
        .flat()
        .reduce((p, c) => {
          if (p.indexOf(c) === -1) {
            p.push(c)
          }
          return p
        }, [])
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
div.upload-btn {
  padding: 0px;
}
.missing {
  font-style: italic;
  color: gray;
}
</style>
