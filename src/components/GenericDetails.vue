<template>
  <b-card
    bg-variant="light"
    :header="DetailsObject.title"
    no-body
    style="max-width: 20rem"
  >
    <b-list-group flush>
      <b-list-group-item v-for="label in DetailsObject.labels" :key="label.id"
        ><strong>{{ label | capitalize }}</strong> :
        {{ DetailsObject.item[label] }}</b-list-group-item
      >
    </b-list-group>
  </b-card>
</template>

<script>
export default {
  props: {
    DetailsObject: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      title: "Client List",
      item: { id: 1, name: "Pritam" },
      labels: ["id", "name"],
    };
  },
  mounted() {
    this.title = this.DetailsObject.title;
    this.item = this.DetailsObject.item;
    this.labels = this.DetailsObject.label;
  },
};
</script>

