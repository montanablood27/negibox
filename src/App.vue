<template>
  <div id="q-app">
<!--    <title-bar-->
<!--      v-if="isRenderer()"-->
<!--      :showActions="hideAppMenu"-->
<!--    />-->
    <router-view />
    <engine-client
      :secret="rpcSecret"
    />
    <ipc v-if="$q.platform.is.desktop" />
  </div>
</template>

<script>

import TitleBar from 'src/components/Native/TitleBar'
import EngineClient from 'src/components/Native/EngineClient'
import Ipc from 'src/components/Native/Ipc'
import { mapState } from 'vuex'
// import { getLangDirection } from 'src/shared/utils'

export default {
  name: 'App',
  components: {
    [TitleBar.name]: TitleBar,
    [EngineClient.name]: EngineClient,
    [Ipc.name]: Ipc
  },
  computed: {
    ...mapState('app', {
      systemTheme: state => state.systemTheme
    }),
    ...mapState('task', {
      // hideAppMenu: state => {
      //   return (this.$q.platform.is.win || this.$q.platform.is.linux) && state.config.hideAppMenu
      // },
      rpcSecret: state => state.config.rpcSecret
      // theme: state => state.config.theme,
      // locale: state => state.config.locale,
      // dir: state => getLangDirection(state.config.locale)
    })
  }
}
</script>
