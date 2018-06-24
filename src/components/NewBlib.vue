<template>
    <div>
        <v-btn
            @click.stop="dialog = true"
            color="primary"
            v-model="fab"
            fab
            fixed
            bottom
            right
        >
        <v-icon>add</v-icon>
        </v-btn>
        <v-dialog v-model="dialog" max-width="500px">
            <v-card>
                <v-card-title>
                    Blib
                </v-card-title>
                <v-card-text>
                    <v-form v-model="valid" ref="form">
                        <v-text-field
                        v-model="title"
                        label="Title"
                        required
                        :rules="[v => !!v || 'Item is required']"
                        >
                        </v-text-field>
                        <v-text-field
                        v-model="link"
                        label="Link"
                        >
                        </v-text-field>
                        <v-select
                        :items="categories"
                        v-model="category"
                        label="Category"
                        single-line
                        required
                        :rules="[v => !!v || 'Item is required']"
                        >
                        </v-select>
                        <v-select
                        :items="states"
                        v-model="state"
                        label="State"
                        single-line
                        required
                        :rules="[v => !!v || 'Item is required']"
                        ></v-select>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" flat @click.stop="dialog=false">Cancel</v-btn>
                    <v-btn color="primary" flat @click="submit">Save</v-btn>
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
      categories: [{ text: 'tools' }, { text: 'cloud' }, { text: 'backend' }, { text: 'datascience' }],
      state: null,
      states: [{ text: 'hold' }, { text: 'assess' }, { text: 'trial' }, { text: 'adopt' }],
      title: null,
      link: null
    }
  },
  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('addBlip', {
          category: this.category.text,
          link: this.link,
          status: this.state.text,
          title: this.title
        })
        this.dialog = false
      }
    }
  }
}
</script>
