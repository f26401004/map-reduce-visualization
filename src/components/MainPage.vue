<template lang="pug">
  v-container(fill-height align-start)
    v-row(class="fill-height" )
      v-col(cols="9")
        v-container(class="fill-height")
          v-sheet(width="100%" height="100%" outlined rounded)
      v-col(cols="3" class="fill-height")
        perfect-scrollbar(class="pr-6" style="max-height: calc(100vh - 120px); overflow-y: auto")
          v-card
            v-toolbar(color="blue" dark)
              v-toolbar-title Options
            v-container(class="pt-8 pl-6 pr-6")
              p(class="mb-6 grey--text")
                v-icon(class="mr-2") mdi-information
                span Please be sure to set the options carefully.
              v-file-input(
                v-model="currentOptions.demoFile"
                label="File Input"
                placeholder="Select your large text file"
                outlined
                :show-size="1000")
              v-select(
                v-model="currentOptions.demoExample"
                label="Demo Examples"
                outlined
                item-text="name"
                item-value="value"
                :items="examples")
              div(v-show="currentOptions.demoExample === 1")
                p(class="grey--text") Please input the search keyword
                v-text-field(
                  v-model="currentOptions.keywrod"
                  label="Keyword"
                  outlined)
              v-text-field(
                v-model="currentOptions.clusters"
                type="number"
                label="Cluster(s)"
                outlined)
              v-text-field(
                v-model="currentOptions.replicas"
                type="number"
                label="Replica(s)"
                outlined)
          v-container
            p(class="blue--text mt-4") This is the demonstration of map-reduce algorithm used in distributed system. You are allowed to trigger the whole map-reduce algorithm process by the following steps:
            div
              p(class="mb-0") 1. Upload text file
              p(class="grey--text") The text file might consist of tremendous sentences or words with separate space between each others.
            div
              p(class="mb-0") 2. Select the type of demonstration
              p(class="grey--text") Currently support only for word count or word search.
            div
              p(class="mb-0") 3. Set the number of cluster for map-reduce algorithm
              p(class="grey--text") The number of cluster has impact on the whole speed of map-reduce algorithm, which presents that how many computing device in the distributed system to perform the map-reduce algorithm.
            div
              p(class="mb-0") 4. Set the number of replica for map-reduce algorithm
              p(class="grey--text") The number of replica has impact on the whole availability of map-reduce algorithm, which presents that how many copy of the data in the distributed system.
</template>

<script>
export default {
  name: 'MainPage',
  data: () => ({
    currentOptions: {
      demoFile: null,
      demoExample: 0,
      keywork: '',
      clusters: 1,
      replicas: 1
    },
    examples: [{
      name: 'Word Count',
      value: 0
    }, {
      name: 'Word Search',
      value: 1
    }]
  })
}
</script>
