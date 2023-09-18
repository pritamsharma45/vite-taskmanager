/*
 *
 *  Send WhatsApp with Google Sheets
 *  ================================
 *
 *  Written by Pritam Sharma
 *  Google Developer Expert - Google Apps Script
 */

const WHATSAPP_ACCESS_TOKEN =
  "EAAKLlkZBPaKMBAI6zJ8Kj8Fhh9Jr1TGZCT8ZA0ZBuiMT2nJyPBxZCnfxyraiz37FS0FgtmEi5ZCPRVUMa2GnWTsPBkMKxZBmF3xpMUHa5S3lGIKvsbvoUIWi1IcFLhLySRlHvsmiPEFeDaznTPg8gk3SPAhgzfNWQsHTpKFHFxKtMJVHZAJYQUCCdQIPCBOS4m0N2U5wJ8CWTwZDZD";
const WHATSAPP_TEMPLATE_NAME = "task_reminder";
const LANGUAGE_CODE = "en_US";

function sfdfas() {
  sendMessage({
    recipient_number: "dfsdfsd",
    customer_name: "Mike",
    task_name: "Self Assesment",
    deadline_date: "15/06/2022",
  });
}
const sendMessage = (o) => {
  // Logger.log(recipient_number);
  // Logger.log(customer_name);
  // Logger.log(delivery_date);
  const apiUrl = "https://graph.facebook.com/v13.0/104379728965426/messages";
  const request = UrlFetchApp.fetch(apiUrl, {
    muteHttpExceptions: true,
    method: "POST",
    headers: {
      Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    payload: JSON.stringify({
      messaging_product: "whatsapp",
      type: "template",
      to: o.recipient_number,
      template: {
        name: WHATSAPP_TEMPLATE_NAME,
        language: { code: LANGUAGE_CODE },
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: o.customer_name,
              },
              {
                type: "text",
                text: o.task_name,
              },
              {
                type: "text",
                text: o.deadline_date,
              },
            ],
          },
        ],
      },
    }),
  });

  const { error } = JSON.parse(request);

  const status = error
    ? `Error: ${error}`
    : `Message sent to ${recipient_number}`;
  Logger.log(JSON.stringify(error));
};

const getSheetData_ = () => {
  const [header, ...rows] = SpreadsheetApp.getActiveSheet()
    .getDataRange()
    .getDisplayValues();
  const data = [];
  rows.forEach((row) => {
    const recipient = {};
    header.forEach((title, column) => {
      recipient[title] = row[column];
    });
    data.push(recipient);
  });
  return data;
};

const main = () => {
  const data = getSheetData_();
  data.forEach((recipient) => {
    const status = sendMessage({
      recipient_number: recipient["Phone Number"].replace(/[^\d]/g, ""),
      customer_name: recipient["Customer Name"],
      task_name: recipient["Item Name"],
      deadline_date: recipient["Delivery Date"],
    });
  });
};
