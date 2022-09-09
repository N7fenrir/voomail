<script setup lang="ts">
import { ref } from "vue";
// @ts-ignore
import * as qs from "qs";
import type { Ref } from "vue";
import axios from "axios";
import router from "@/router";

let username = ref("");
let password = ref("");
let errors: Ref<string[]> = ref([]);

async function doLogin() {
  errors.value = [];
  const data = { user: username.value, pass: password.value };
  if (data.user !== "" && data.pass !== "") {
    const options = {
      method: "post",
      url: "http://localhost:8080/login",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: qs.stringify({
        user: `${username.value}`,
        pass: `${password.value}`,
      }),
    };
    const res = await axios(options);
    if (res.status === 200) {
      await router.push("/mailClient");
    } else {
      errors.value.push(res.data);
    }
  } else {
    if (data.user === "" || !data.user) {
      errors.value.push("Please enter a username");
    }
    if (data.pass === "" || !data.pass) {
      errors.value.push("Please enter a password");
    }
  }
}

function doRegister() {
  window.location.href = "https://mailtrap.io";
}
</script>

<style>
.container {
  width: 400px;
  max-width: 95%;
}
.input {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}
.input > label {
  text-align: start;
}
.input > input {
  margin-top: 6px;
  height: 38px !important;
}
/* From uiverse.io */
.btn-pers {
  position: relative;
  left: 50%;
  padding: 1em 2.5em;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  font-weight: 700;
  color: #000;
  background-color: #fff;
  border: none;
  border-radius: 45px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;
  transform: translateX(-50%);
}
.btn-pers:hover {
  background-color: #198754;
  box-shadow: 0px 15px 20px rgba(46, 229, 157, 0.4);
  color: #fff;
}
.btn-pers:active {
  background-color: #198754;
  box-shadow: 0px 15px 20px rgba(46, 229, 157, 0.4);
  color: #fff;
}
/*  */
.alternative-option {
  text-align: center;
}
.alternative-option > span {
  color: #0d6efd;
  cursor: pointer;
}
</style>

<template>
  <main>
    <div class="container">
      <form @submit.prevent="login">
        <h2 class="mb-3">Login</h2>
        <div class="input">
          <label for="email">Mail-trap</label>
          <input
            v-model="username"
            class="form-control"
            type="text"
            name="email"
            placeholder="username"
          />
        </div>
        <div class="input">
          <label for="password">Password</label>
          <input
            v-model="password"
            class="form-control"
            type="password"
            name="password"
            placeholder="password"
          />
        </div>
        <div class="alternative-option mt-4">
          You don't have an account? <span @click="doRegister">Register</span>
        </div>
        <button
          @click="doLogin"
          type="submit"
          class="mt-4 btn-pers"
          id="login_button"
        >
          Login
        </button>
      </form>
      <ul v-if="errors.length > 0">
        <li
          style="color: red"
          v-for="(err, index) in errors.values()"
          v-bind:key="index"
        >
          {{ err }}
        </li>
      </ul>
    </div>
  </main>
</template>
