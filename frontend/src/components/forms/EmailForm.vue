<script setup lang="ts">
import { ref } from "vue";
import type { Ref } from "vue";
const staticGreeting = `Hi {{Contact Name}} \n`;
let content = ref(``);
let preview = ref(`${staticGreeting}`);
let serverMessage: Ref<Record<string, string | boolean>[]> = ref([]);

async function sendEmails() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("content", JSON.stringify(content));

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    responseType: "stream",
  };

  fetch("http://localhost:8080/mail", requestOptions)
    .then((response) => {
      if (response.body) {
        const reader = response.body.getReader();
        return new ReadableStream({
          start(controller) {
            return pump();
            function pump(): any {
              return reader.read().then(({ done, value }) => {
                // When no more data needs to be consumed, close the stream
                if (done) {
                  controller.close();
                  return;
                }
                // Enqueue the next data chunk into our target stream
                controller.enqueue(value);
                return pump();
              });
            }
          },
        });
      }
    })
    .then((stream) => new Response(stream))
    .then((response) => response.blob())
    .then((blob) => blob.text())
    .then((data) => {
      const tempData = data.match(/{([^}]+)}/g);
      const content: string[] = tempData ? tempData : [];
      if (content.length > 0) {
        const messages: Record<string, string>[] = content.map((e) =>
          JSON.parse(e)
        );
        messages.forEach((e) => {
          serverMessage.value.push(e);
        });
      }
    })
    .catch((err) => console.error(err));
}

function updatePreview(event: any) {
  preview.value = staticGreeting + event.target.value;
}
</script>

<template>
  <div
    style="
      width: 100%;
      height: fit-content;
      margin: 1rem auto;
      text-align: center;
    "
  >
    <h2>Mail Blaster</h2>
  </div>

  <form>
    <div class="form-group row">
      <div class="col-12">
        <textarea
          id="email-content"
          @keyup="updatePreview($event)"
          v-model="content"
          name="email-content"
          cols="25"
          rows="5"
          class="form-control"
          required="required"
        >
        </textarea>
      </div>
    </div>
    <div
      style="
        width: 100%;
        height: fit-content;
        margin: 1rem auto;
        text-align: center;
      "
      class="form-group row"
    >
      <div class="col-12">
        <h4>Mail Preview</h4>
      </div>
    </div>

    <div class="form-group row">
      <div class="col-12">
        <textarea
          disabled
          v-model="preview"
          name="email-preview"
          cols="25"
          rows="5"
          class="form-control"
        >
        </textarea>
      </div>
    </div>
    <div class="form-group row">
      <div class="offset-4 col-8">
        <button
          name="submit"
          type="button"
          @click="sendEmails"
          class="btn btn-primary"
        >
          Send
        </button>
      </div>
    </div>
  </form>

  <div class="panel panel-primary" id="result_panel">
    <div class="panel-heading"><h3 class="panel-title">Result List</h3></div>
    <div class="panel-body">
      <ul class="list-group" v-if="serverMessage.length > 0">
        <li
          class="error-list list-group-item"
          v-for="(message, index) in serverMessage.values()"
          :class="{ 'success-list': message.status }"
          v-bind:key="index"
        >
          {{ message.message }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.error-list {
  color: red;
}
.success-list {
  color: green;
}

.list-group {
  max-height: 300px;
  margin-bottom: 10px;
  overflow-y: scroll;
}
</style>
