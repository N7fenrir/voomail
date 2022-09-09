<script setup lang="ts">
import WelcomeMessage from "@/components/welcome/WelcomeMessage.vue";
import LoginForm from "@/components/forms/LoginForm.vue";
</script>

<style>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

}


#app {
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-items: center;
  font-weight: normal;
}


a,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

@media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

  #app {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
  }
}

</style>


<template>
  <div id="app">
  <main style="margin: 10%">
    <header>
      <img
          alt="Vue logo"
          class="logo"
          src="@/assets/logo.svg"
          width="125"
          height="125"
      />

      <div class="wrapper">
        <WelcomeMessage msg="Voo Mail " />
      </div>
    </header>
  </main>
  <LoginForm />
  </div>
</template>
