<template>
  <v-container>
    <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-list two-line>
          <template v-for="(item, index) in userList">
            <v-list-item
              v-bind:key="index"
              ripple
            >
              <v-list-item-content>
                <v-list-item-title>{{ item.name }} ({{ item.uid }})</v-list-item-title>
                <v-list-item-subtitle>last seen: {{ item.lastLogin }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-list-item-action-text>Viewer</v-list-item-action-text>
                <v-btn
                icon
                @click="setRole(index, 'viewer', !item.roles.viewer)"
                v-bind:key="item.roles.viewer"
                >
                  <v-icon
                    v-if="item.roles.viewer"
                    color="primary darken-1"
                  >visibility</v-icon>
                  <v-icon
                    v-else
                    color="grey lighten-1"
                  >visibility</v-icon>
                </v-btn>
              </v-list-item-action>
              <v-list-item-action>
                <v-list-item-action-text>Editor</v-list-item-action-text>
                <v-btn
                icon
                @click.prevent="setRole(index, 'editor', !item.roles.editor)"
                v-bind:key="item.roles.editor"
                >
                  <v-icon
                    v-if="item.roles.editor"
                    color="primary darken-1"
                  >edit</v-icon>
                  <v-icon
                    v-else
                    color="grey lighten-1"
                  >edit</v-icon>
                </v-btn>
              </v-list-item-action>
              <v-list-item-action>
                <v-list-item-action-text>Admin</v-list-item-action-text>
                <v-btn
                icon
                @click.prevent="setRole(index, 'admin', !item.roles.admin)"
                v-bind:key="item.roles.admin"
                >
                  <v-icon
                    v-if="item.roles.admin"
                    color="primary darken-1"
                  >star</v-icon>
                  <v-icon
                    v-else
                    color="grey lighten-1"
                  >star</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { User } from '@/types/domain'

@Component({
  computed: {
    userList () {
      return this.$store.getters['user/userList']
    },
    user () {
      return this.$store.getters['user/user']
    }
  }
})
export default class Users extends Vue {
  items: []
  roles: []
  // computed
  user: User
  userList: any

  setRole (index, role, value) {
    this.userList[index].roles[role] = value
    const targetUser = this.userList[index]
    if (targetUser.uid === this.user.uid && role === 'admin') {
      console.warn('Preventing admin removal for own user') // eslint-disable-line no-console
      this.$store.dispatch('user/getUserList')
    } else {
      this.$store.dispatch('user/setRoles', { targetUser })
    }
  }

  mounted () {
    this.$store.dispatch('user/getUserList')
  }
}
</script>
