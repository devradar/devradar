<template>
  <v-dialog v-model="$parent.newChangeModalVisible" max-width="80%">
    <v-card>
      <v-card-title class="title">
        Add new entry to Blip history
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-container grid-list-md>
            <v-layout row wrap justify-space-around>
              <v-flex sm6 xs12 d-flex>
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-select :items="levels" v-model="level" label="Level" single-line required :rules="[v => !!v || 'Level is required']"
                      data-cy="blip-history-level" @change="$store.dispatch('intro/event', 'blip-history-level-changed')"></v-select>
                  </v-flex>
                  <v-flex xs12>
                    <v-textarea v-model="changeText" label="Reason for change" rows="2"
                      data-cy="blip-history-reason" @change="$store.dispatch('intro/event', 'blip-history-reason-changed')"></v-textarea>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex md4 sm6 xs12>
                <v-date-picker v-model="date" type="month"
                  data-cy="blip-history-date" @change="$store.dispatch('intro/event', 'blip-history-date-changed')"></v-date-picker>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn @click.stop="cancel">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click.stop="submit" data-cy="blip-history-submit">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator'
import { BlipChange } from '@/types/domain'
import { VForm } from '@/types/misc'

@Component({
  computed: {
    change () {
      return {
        date: this.date,
        newLevel: this.levels.indexOf(this.level),
        text: this.changeText
      }
    },
    levels () {
      return this.$store.getters['blips/meta'].levels
    },
    form () {
      return this.$refs.form as VForm
    }
  }
})

export default class NewChange extends Vue {
  valid = false
  dialog = true
  level = ''
  date: string = new Date().toISOString().slice(0, 7)
  changeText = ''
  // computed
  change: BlipChange
  levels: string[]
  form: VForm

  @Emit()
  submit () : BlipChange {
    if (this.form.validate()) {
      this.$store.dispatch('intro/event', 'blip-history-submit')
      setTimeout(() => this.reset(), 100)
      return this.change
    }
  }

  @Emit()
  cancel () : BlipChange {
    setTimeout(() => this.reset(), 100)
    return this.change
  }

  reset () : void {
    this.level = null
    this.date = new Date().toISOString().slice(0, 7)
    this.changeText = null
  }
}
</script>
