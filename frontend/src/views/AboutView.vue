<script lang="ts">
import { onBeforeMount, ref } from "vue";
import type { Ref } from "vue";
import EmailForm from "../components/forms/EmailForm.vue";
import DataTable from "../components/DataTable.vue";

export default {
  components: { EmailForm, DataTable },
};

let users: Ref<Record<string, string>[]> = ref([]);
let loading = ref(false);
let fields: Ref<Record<string, number | boolean | string>[]> = ref([
  { id: 1, key: "name", label: "Name", type: "text", editable: true },
  { id: 2, key: "email", label: "Email", type: "email", editable: true },
  { id: 3, key: "phone", label: "Phone", type: "text", editable: true },
]);

onBeforeMount(async () => {
  loading.value = true;
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  users.value = await response.json();
  console.log(users.value);
  loading.value = false;
});
</script>

<template>
  <main style="width: 100%; height: 100%">
    <div class="container-fluid">
      <div class="row gx-4 justify-content-center">
        <div class="col-md-6">
          <DataTable />
        </div>
        <div class="col-md-6">
          <EmailForm />
        </div>
      </div>
    </div>
  </main>
</template>
