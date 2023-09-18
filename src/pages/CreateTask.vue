<template>
       <div class="container">    

        <b-card header-bg-variant="success" bg-variant="light" header-text-variant="white" style="max-width: 50rem;">
      <template #header >
     
       <h2 >{{title}}</h2>
       
      </template>
      <b-card-body>
      <form action="" @submit.prevent="createEntity">
                <vue-form-generator tag="div" :schema="schema" :options="formOptions" :model="model" />
                <div class="d-flex justify-content-end mt-3 pr-4">
                    <button type="submit" class="btn btn-primary btn-lg">
                        {{ isSaving ? 'Saving...' : 'Submit'}}
                    </button>
                </div>
            </form>
      </b-card-body>
  
    </b-card>
    </div>
</template>

<script>

import { createEntity } from '../mixins/createEntityMixin.js'

export default {
   mixins: [createEntity("task")],
  name: 'CreateTask',
}
</script>

<style></style>