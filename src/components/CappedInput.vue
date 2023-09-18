<template>
  <div class="input-group mb-3">
    <div class="input-group-prepend">
      <span class="input-group-text">{{preText}}</span>
    </div>
    <input
      type="text"
      class="form-control"
      v-model="value"
      :disabled="disabled"
      :maxlength="schema.max"
      :placeholder="schema.placeholder"
      :readonly="schema.readonly"
      style="maxWidth:20rem"
      aria-label="Amount (to the nearest dollar)"
    />
    <div class="input-group-append">
      <span class="input-group-text">{{endText}}</span>
    </div>
    <button @click="clickMe()" type="button" class="btn btn-light">
      Show client detail
    </button>
   


<!-- Button trigger modal -->
<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
  Launch demo modal
</button>

<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
       <create-entity :schema="clientSchema" :cardView="false"></create-entity>
      </div>
  
    </div>
  </div>
</div>


  </div>
</template>

<script>
import clientSchema from "../forms/client";
import FormClient from "../pages/CreateEntity.vue";
import { abstractField } from "vue-form-generator";
export default {
  props:{
 preText:{
       type: String,
      required: true
    },
     endText:{
       type: String,
      required: true
    },
  },
  components: {
    FormClient,
  },
  mixins: [abstractField],
  data() {
    return {
      showClientInfo: false,
      showClientEditView: false,
      clientSchema:clientSchema,
    };
  },
  methods: {
    clickMe() {
      console.log("Iam clicked");
      console.log("Schema Model", this.schema.model);
    },
    showClientInfo() {
      console.log("Showing client Info");
    },
  },
};
</script>
