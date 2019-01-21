<template>
  <div>
    <v-btn
      @click.stop="dialog = true"
      color="accent" v-model="fab"
      fab fixed bottom right
      v-if="userCanEdit"
    >
      <v-icon>add</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="title">
          Add new Blip
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-container grid-list-md>
              <v-layout row wrap>
                <v-flex sm6 xs12>
                  <v-text-field v-model="title" label="Title" required :rules="[v => !!v || 'Title is required']"></v-text-field>
                </v-flex>
                <v-flex sm6 xs12>
                  <v-text-field v-model="link" label="Link">
                  </v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="description" label="Technology use" multi-line rows="3"></v-text-field>
                </v-flex>
                <v-flex sm6 xs12>
                  <v-select :items="categories" v-model="category" label="Category" single-line required :rules="[v => !!v || 'Category is required']"></v-select>
                </v-flex>
                <v-flex sm6 xs12>
                  <v-select :items="states" v-model="state" label="State" single-line required :rules="[v => !!v || 'State is required']"></v-select>
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="changeText" label="Reason for change" multi-line rows="2"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" flat @click.stop="cancel">Cancel</v-btn>
          <v-btn color="primary" flat @click.stop="submit">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      valid: false,
      fab: false,
      dialog: false,
      category: null,
      categories: this.$config.categories,
      state: null,
      states: this.$config.states,
      title: null,
      link: null,
      description: null,
      changeText: null
    }
  },
  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('addBlip', { blip: this.blip, change: this.change })
        this.dialog = false
        this.clear()
      }
    },
    cancel () {
      this.dialog = false
      this.clear()
    },
    clear () {
      this.category = null
      this.state = null
      this.title = null
      this.link = null
      this.description = null
      this.changeText = null
    }
  },
  computed: {
    blip () {
      return {
        category: this.category,
        link: this.link,
        title: this.title,
        description: this.description
      }
    },
    change () {
      return {
        newState: this.state,
        text: this.changeText,
        date: (new Date()).toISOString().split('-').slice(0, 2).join('-')
      }
    },
    userCanEdit () {
      return this.$store.getters.userCanEdit
    }
  }
}
</script>
