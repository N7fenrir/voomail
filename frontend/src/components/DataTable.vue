
<script setup lang="ts">
import {onMounted, ref} from 'vue';
import type { Ref } from 'vue'
import axios from 'axios';

const tableData : Ref<Record<string, string>[]> = ref([])
let currentEditableElement: Record<string, string> = {}

async function deleteItem(emailAddress:string, index:number) {
  const config = {
    method: 'delete',
    url: `http://localhost:8080/contact/${emailAddress}`,
    headers: { },
    data : ''
  };
  const res = await axios(config);
  if(res.data){
  tableData.value.splice(index, 1)
  } else{
    console.error('Unable to delete')
  }
}

async function updateContact(newVal:string, updateBy: string) {
  if(newVal !== currentEditableElement[updateBy]){
    const changed = updateBy === 'contact_email' ? 'changeEmail' : 'changeName';
    const config = {
      method: 'patch',
      url: `http://localhost:8080/contact/${currentEditableElement.contact_email}?${changed}=${newVal}`,
      headers: { },
      data : ''
    };
    await axios(config)
  }
}


async function addItem() {
  const tempItem = {contact_name: "New Item", contact_email: "New Item"};
  let currentTop = tableData.value.length>0 ? tableData.value[0] : {};
  if(currentTop.contact_name !== tempItem.contact_name || currentTop.contact_email !== tempItem.contact_email){
    tableData.value.unshift({contact_name: "New Item", contact_email: "New Item"})
    currentTop = tempItem;
    const config = {
      method: 'put',
      url: `http://localhost:8080/contact/${currentTop.contact_email}/${currentTop.contact_name}`,
      headers: {},
      data : ''
    };
    await axios(config);
  }
}


function storeCurrentItem(item: Record<string, string>){
  currentEditableElement = {
    contact_name: item.contact_name,
    contact_email: item.contact_email
  };
}


onMounted(()=>{
  const config = {
    method: 'get',
    url: 'http://localhost:8080/contact',
    headers: {}
  };

  axios(config)
      .then(function (response) {
        tableData.value = response.data.contacts;
      })
      .catch(function (error) {
        console.log(error);
      });
})

</script>


<template>
  <div id="infinite-table" class="table-responsive">
    <table class="table table-sm table-bordered table-hover">
      <thead >
      <tr>
        <th>Email Address</th>
        <th>Contact Name</th>
        <th><button @click="addItem()" class="btn"><i class="fa fa-plus"></i></button></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in tableData.values()">
          <th scope="row"><input class="noBordersInput" v-model="item.contact_email" @focusout="updateContact(item.contact_email, 'contact_email')"  @focusin="storeCurrentItem(item)" /> </th>
          <td><input class="noBordersInput" v-model="item.contact_name" @focusout="updateContact(item.contact_name, 'contact_name')"  @focusin="storeCurrentItem(item)" /> </td>
          <td><button @click="deleteItem(item.contact_email, index)" class="btn"><i class="fa fa-trash"></i></button></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
#infinite-table {
  min-height: 25%;
  max-height: 100%;
  overflow: auto;
}

table {
  border-spacing: 0;
  width: 100%;
  min-height: 25%;
  height: 100%;
  border: 1px solid #ddd;
  table-layout: fixed;
}

thead tr th {
  background: white;
  position: sticky;
  top: 0;
  z-index: 99;
}

th,
td {
  overflow: hidden;
  text-align: left;
  padding: 16px;
  height: 1.5rem;
}

tr {
  line-height: 1.5rem;
  min-height: 1.5rem;
  height: 1.5rem;
}

.noBordersInput {
  border:0;
  outline:0;
}

</style>
