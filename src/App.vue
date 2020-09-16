<template lang="pug">
  v-app
    v-app-bar(
      app
      color="indigo"
      dark)
      div(class="d-flex align-center")
        h5(class="text-h5 text-left") Map/Reduce Algorithms Visualization
    v-main
      main-page
</template>

<script>
import MainPage from '@/components/MainPage.vue'

export default {
  name: 'App',
  components: {
    MainPage
  },

  data: () => ({
    //
  })
}
</script>
