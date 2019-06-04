<template>
  <v-container
    fluid
    grid-list-lg>
    <v-card>
      <v-container fluid grid-list-lg>
        <v-layout row>
          <v-flex xs12>
              <span class="headline">
                Your devradar content
              </span>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs12>
            <v-textarea
              name="content-encoded"
              box rows="8"
              label="Encoded"
              append-outer-icon="attach_file"
              @click:append-outer="copyContent()"
              @focus="$event.target.select()"
              v-model="contentEncoded"
            ></v-textarea>
          </v-flex>
        </v-layout>
        <v-layout row justify-end>
          <v-flex xs2>
            <v-btn
            @click.end="loadContent()"
            outline>
              Update
              <v-icon right>send</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import copy from 'clipboard-copy'
import lzs from 'lz-string'

export default {
  data: () => ({
    contentEncoded: ''
  }),
  computed: {
    blips () {
      return this.$store.getters.blipsArray
    },
    meta () {
      return this.$store.getters.meta
    }
  },
  methods: {
    copyContent () {
      const b = this.contentEncoded
      const success = copy(b)
      if (success) {
        this.$store.dispatch('showSnackbar', 'content copied to clipboard')
      } else {
        console.error(success)
      }
    },
    fetchContent () {
      const obj = {
        meta: this.meta,
        blips: this.blips
      }
      const string = JSON.stringify(obj)
      this.contentEncoded = lzs.compressToEncodedURIComponent(string)
    },
    // move content from view to vuex
    loadContent () {
      const string = lzs.decompressFromEncodedURIComponent(this.contentEncoded)
      try {
        const obj = JSON.parse(string)
        this.$store.dispatch('setBlips', obj.blips)
        this.$store.dispatch('setMeta', obj.meta)
        this.$store.dispatch('showSnackbar', 'updated local blips + config')
      } catch (e) {
        console.error('Error occured trying to decompress content', e)
      }
    }
  },
  mounted () {
    this.fetchContent()
  }
}
</script>
