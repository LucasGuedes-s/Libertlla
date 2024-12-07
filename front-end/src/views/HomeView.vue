<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <NavBar/>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar.vue'

export default {
  name: 'HomeView',
  components: {
    NavBar
  }
}
</script>
