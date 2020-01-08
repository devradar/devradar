<template>
  <v-dialog v-model="$parent.newChangeModalVisible" max-width="80%">
    <v-card>
      <v-card-title class="title">
        Add new blip level
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-container grid-list-md>
            <v-layout row wrap justify-space-around>
              <v-flex sm6 xs12 d-flex>
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-select :items="levels" v-model="level" label="Level" single-line required :rules="[v => !!v || 'Level is required']"></v-select>
                  </v-flex>
                  <v-flex xs12>
                    <v-textarea v-model="changeText" label="Reason for change" rows="2"></v-textarea>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex md4 sm6 xs12>
                <v-date-picker v-model="date" type="month"></v-date-picker>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn @click.stop="cancel">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click.stop="submit">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Emit, InjectReactive } from 'vue-property-decorator'
import { Blip, BlipChange } from '@/types/domain'
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
  @InjectReactive() readonly newChangeBlip!: Blip

  valid: boolean = false
  dialog: boolean = true
  level: string = ''
  date: string = new Date().toISOString().slice(0, 7)
  changeText: string = ''
  // computed
  change: BlipChange
  levels: string[]
  form: VForm

  @Emit()
  submit () {
    if (this.form.validate()) {
      setTimeout(() => this.reset(), 100)
      return { change: this.change, blip: this.newChangeBlip }
    }
  }

  @Emit()
  cancel () {
    setTimeout(() => this.reset(), 100)
    return { change: this.change, blip: this.newChangeBlip }
  }

  reset () {
    this.level = null
    this.date = new Date().toISOString().slice(0, 7)
    this.changeText = null
  }
}
</script>
