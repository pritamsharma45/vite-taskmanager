import moment from "moment";
export default {
  methods: {
    whatsapp(item) {
      console.log("Whats Appp Clicked");
      const number = "919624701102";
      const client = this.config["tbl_client"][item.client_id]["client_name"];
      const task = this.config["tbl_task_type"][item.task_type_id]["task_type"];
      const deadline_date =
        moment(item.deadline_date).format("DD/MM/YYYY") || "";

      const o = {
        recipient_number: number,
        customer_name: client,
        task_name: task,
        deadline_date: deadline_date,
      };
      console.log("Payload ", o);
      google.script.run
        .withSuccessHandler((res) => {
          console.log("Whats App :", res);
        })
        .withFailureHandler((error) => {
          console.log("Whats App Error:", error);
        })
        .sendMessage(o);
    },
    isMobile() {
      return window.innerWidth <= 800 && window.innerHeight <= 600;
    },
    whatsapp_click_to_chat(item) {
      const client = this.config["tbl_client"][item.client_id]["client_name"];
      const task = this.config["tbl_task_type"][item.task_type_id]["task_type"];
      const deadline_date =
        moment(item.deadline_date).format("DD/MM/YYYY") || "";
      const phoneNumber = this.config["tbl_client"][item.client_id]["phone"];
      const message = `Dear ${client},
This is regarding your ${task} which is due on ${deadline_date}.
Please submit the required information before ${deadline_date} in order for us to file before the deadline.`;
      const messageText = encodeURIComponent(message);
      const url =
        this.isMobile() === false
          ? `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${messageText}`
          : `https://wa.me/${phoneNumber}?text=${messageText}`;
      window.open(url);
      // return web === true
      //   ? `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${messageText}`
      //   : `https://wa.me/${phoneNumber}?text=${messageText}`;
    },
  },
};
