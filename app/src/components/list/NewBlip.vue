<template>
  <div>
    <v-btn
      @click.stop="addButtonClick()"
      color="primary" v-model="fab"
      fab fixed bottom right
      v-if="userCanEdit"
      data-cy="blip-new-button"
      id="floaty"
    >
      <v-icon>add</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card data-cy="blip-new-modal">
        <v-card-title class="title">
          Add new Blip
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-container grid-list-md>
              <v-layout row wrap>
                <v-flex sm6 xs12>
                  <v-text-field v-model="title" label="Title" required :rules="[v => !!v || 'Title is required']"
                    data-cy="blip-new-title"
                    ></v-text-field>
                </v-flex>
                <v-flex sm6 xs12>
                  <v-text-field v-model="link" label="Link"
                    data-cy="blip-new-link"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-textarea v-model="description" label="Technology use" rows="3"
                  data-cy="blip-new-description"
                  ></v-textarea>
                </v-flex>
                <v-flex sm6 xs12>
                  <v-select :items="categories" v-model="category" label="Category" single-line required :rules="[v => !!v || 'Category is required']"
                    data-cy="blip-new-category"
                  ></v-select>
                </v-flex>
                <v-flex sm6 xs12>
                  <v-select :items="levels" v-model="level" label="Level" single-line required :rules="[v => !!v || 'Level is required']"
                    data-cy="blip-new-level"
                  ></v-select>
                </v-flex>
                <v-flex xs12>
                  <v-textarea v-model="changeText" label="Reason for change" rows="2"
                  data-cy="blip-new-changeText"
                  ></v-textarea>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn @click.stop="cancel"
            data-cy="blip-new-cancel"
          >Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn @click.stop="submit" color="primary"
            data-cy="blip-new-submit"
          >Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Blip, BlipChange } from '@/types/domain'
import { VForm } from '@/types/misc'

@Component({
  computed: {
    blip () {
      return {
        category: this.categories.indexOf(this.category),
        link: this.link,
        title: this.title,
        description: this.description
      }
    },
    change () {
      return {
        newLevel: this.levels.indexOf(this.level),
        text: this.changeText,
        date: (new Date()).toISOString().split('-').slice(0, 2).join('-')
      }
    },
    userCanEdit () {
      return this.$store.getters['user/userCanEdit']
    },
    categories () {
      return this.$store.getters['blips/meta'].categories
    },
    levels () {
      return this.$store.getters['blips/meta'].levels
    },
    form () {
      return this.$refs.form as VForm
    }
  }
})

export default class NewBlip extends Vue {
  valid: boolean = false
  fab: boolean = false
  dialog: boolean = false
  category: string = ''
  level: string = ''
  title: string = ''
  link: string = ''
  description: string = ''
  changeText: string = ''
  // computed
  blip: Blip
  change: BlipChange
  userCanEdit: boolean
  categories: string[]
  levels: string[]
  form: VForm

  addButtonClick () {
    this.$store.dispatch('intro/event', 'add-blip-open')
    this.dialog = true
  }

  submit () {
    if (this.form.validate()) {
      this.$store.dispatch('blips/addBlip', Object.assign(this.blip, { changes: [this.change] }))
      this.dialog = false
      this.clear()
    }
  }

  cancel () {
    this.dialog = false
    this.clear()
  }

  clear () {
    this.category = ''
    this.level = ''
    this.title = ''
    this.link = ''
    this.description = ''
    this.changeText = ''
  }
}
</script>

<style lang="scss" scoped>
#floaty {
  z-index: 10;
}
</style>
