<template>
  <v-dialog v-model="$parent.showChangeDialog">
    <v-card>
      <v-card-title class="title">
        Change blip status
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-container grid-list-md>
            <v-layout row wrap>
              <v-flex sm6 xs12>
                <v-select :items="states" v-model="state" label="Status" single-line required :rules="[v => !!v || 'Status is required']"></v-select>
              </v-flex>
              <v-flex sm6 xs12>
                <v-date-picker v-model="date" type="month"></v-date-picker>
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
</template>

<script>
export default {
  data () {
    return {
      valid: false,
      dialog: true,
      state: null,
      states: this.$config.states,
      date: null,
      changeText: null
    }
  },
  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        this.$emit('submit', this.change)
      }
    },
    cancel () {
      this.$emit('cancel', this.change)
    }
  },
  computed: {
    change () {
      return {
        date: this.date,
        status: this.state,
        changeText: this.changeText,
        blipId: this.$parent.blipForChange.id
      }
    }
  }
}
</script>
