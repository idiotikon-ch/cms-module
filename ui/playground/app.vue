<template>
  <v-app>

    <v-app-bar color="primary" :extended="!smAndUp && shrinkAppBar ? false : true" class="pr-4" density="compact">
      <v-app-bar-nav-icon @click="showDrawer = !showDrawer" :class="xs ? 'mt-2' : 'mt-8'">
      </v-app-bar-nav-icon>
      <v-app-var-nav-item :class="xs ? 'mt-2' : 'mt-8'" :icon="mdiMagnify" @click="router.push({ name: 'search' })"
        class="d-flex align-center justify-center"></v-app-var-nav-item>
      <v-app-bar-title @click="router.push({ name: 'index' })" class="align-self-start" :class="xs ? 'ml-0' : 'ml-2'">
        <a href="/">
          <v-img v-if="xs && !shrinkAppBar" to="/" :src="'/static/img/si_logo_standard_neg_rgb.svg'" class="mt-n2 ml-n2"
            position="left top" height="90px"></v-img>
          <v-img v-else-if="xs && shrinkAppBar" to="/" :src="'/static/img/si_logo_neg_rgb.svg'" class="mt-2 ml-2"
            position="left top" height="31px"></v-img>
          <v-img v-else to="/" :src="'/static/img/si_logo_1z_neg_rgb.svg'" class="mt-1" position="left top"
            height="70px"></v-img>
        </a>
      </v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="showDrawer">
      <v-list>
        <v-list-item link @click="router.push({ name: 'index' })" title="Home"></v-list-item>
        <v-list-item link @click="router.push({ name: 'tiles' })" title="More tiles"></v-list-item>
        <v-list-item link @click="router.push({ name: 'about' })" title="About"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main v-scroll="onScroll" class="d-flex align-center flex-column">
      <v-container fluid class="my-10" :style="{ width: mdAndUp && !showDrawer ? '70%' : '90%', maxWidth: '1150px' }">
        <NuxtPage />
      </v-container>
      <v-tooltip v-model="show" location="left">nach oben
        <template v-slot:activator="{ props }">
          <v-btn v-show="showScrollUp" @click="scrollTop" :icon="mdiChevronUp" v-bind="props" density="comfortable"
            style="z-index: 1; position: fixed"
            :style="{ bottom: lgAndUp ? '50px' : '20px', right: lgAndUp ? '50px' : '20px' }" color="primary"></v-btn>
        </template>
      </v-tooltip>

    </v-main>


  </v-app>
</template>

<script setup>
const onScroll = (event) => {
  const target = event.target?.documentElement;
  if (target.scrollTop >= 10) {
    shrinkAppBar.value = true;
    showScrollUp.value = true;
  }
  else {
    shrinkAppBar.value = false;
    showScrollUp.value = false;
  }
  useEmit("scrollY", target.scrollTop)
}
function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
const showDrawer = true;

</script>
