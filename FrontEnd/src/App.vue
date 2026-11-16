<script setup>
import { ref } from "vue";
import StockAidLogin from "./components/StockAidLogin.vue";
import HomeScreen from "./components/RealRaktar.vue"; // your home screen

const loggedIn = ref(false);
</script>

<template>
  <HomeScreen v-if="loggedIn" />
  <StockAidLogin v-else @login="loggedIn = true" />
</template>