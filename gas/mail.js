/**
 * @OnlyCurrentDoc
 */

const RECIPIENT_COL = "Recipient";
const EMAIL_SENT_COL = "Email Sent";

function sendEmails(subjectLine, table, htmlBody, newSubject, obj) {
  if (obj.length > 0) {
    var files = obj.map(function(e) {
      return Utilities.newBlob(
        Utilities.base64Decode(e.data),
        e.mimeType,
        e.fileName
      );
    });
  }

  if (subjectLine == "Blank") {
    table.forEach(function(row, rowIdx) {
      try {
        htmlBody = fillInTemplateFromObject_(htmlBody, row);
        newSubject = fillInTemplateFromObject_(newSubject, row);
        GmailApp.sendEmail(row[RECIPIENT_COL], newSubject, "", {
          htmlBody: htmlBody,
        });
        // out.push([new Date()]);
      } catch (e) {}
    });
  } else {
    const emailTemplate = getGmailTemplateFromDrafts_(subjectLine);

    table.forEach(function(row, rowIdx) {
      try {
        const msgObj = fillInTemplateFromObject_(emailTemplate.message, row);
        const subject = newSubject !== "" ? newSubject : msgObj.subject;
        GmailApp.sendEmail(row[RECIPIENT_COL], subject, msgObj.text, {
          htmlBody: htmlBody + msgObj.html,
          attachments: files || emailTemplate.attachments,
          inlineImages: emailTemplate.inlineImages,
        });

        out.push([new Date()]);
      } catch (e) {}
    });
  }

  function getGmailTemplateFromDrafts_(subject_line) {
    try {
      // get drafts
      const drafts = GmailApp.getDrafts();
      // filter the drafts that match subject line
      const draft = drafts.filter(subjectFilter_(subject_line))[0];
      // get the message object
      const msg = draft.getMessage();

      //    this msg can be sent from client side

      const allInlineImages = draft.getMessage().getAttachments({
        includeInlineImages: true,
        includeAttachments: false,
      });
      const attachments = draft
        .getMessage()
        .getAttachments({ includeInlineImages: false });
      const htmlBody = msg.getBody();

      const img_obj = allInlineImages.reduce(
        (obj, i) => ((obj[i.getName()] = i), obj),
        {}
      );

      //Regexp searches for all img string positions with cid
      const imgexp = RegExp('<img.*?src="cid:(.*?)".*?alt="(.*?)"[^>]+>', "g");
      const matches = [...htmlBody.matchAll(imgexp)];

      //Initiates the allInlineImages object
      const inlineImagesObj = {};
      // built an inlineImagesObj from inline image matches
      matches.forEach(
        (match) => (inlineImagesObj[match[1]] = img_obj[match[2]])
      );

      return {
        message: {
          subject: subject_line,
          text: msg.getPlainBody(),
          html: htmlBody,
        },
        attachments: attachments,
        inlineImages: inlineImagesObj,
      };
    } catch (e) {
      throw new Error("Oops - can't find Gmail draft");
    }

    /**
     * Filter draft objects with the matching subject linemessage by matching the subject line.
     * @param {string} subject_line to search for draft message
     * @return {object} GmailDraft object
     */
    function subjectFilter_(subject_line) {
      return function(element) {
        if (element.getMessage().getSubject() === subject_line) {
          return element;
        }
      };
    }
  }

  /**
   * Fill template string with data object
   * @see https://stackoverflow.com/a/378000/1027723
   * @param {string} template string containing {{}} markers which are replaced with data
   * @param {object} data object used to replace {{}} markers
   * @return {object} message replaced with data
   */
  function fillInTemplateFromObject_(template, data) {
    // We have two templates one for plain text and the html body
    // Stringifing the object means we can do a global replace
    let template_string = JSON.stringify(template);

    // Token replacement
    template_string = template_string.replace(/{{[^{}]+}}/g, (key) => {
      return escapeData_(data[key.replace(/[{}]+/g, "")] || "");
    });
    return JSON.parse(template_string);
  }

  /**
   * Escape cell data to make JSON safe
   * @see https://stackoverflow.com/a/9204218/1027723
   * @param {string} str to escape JSON special characters from
   * @return {string} escaped string
   */
  function escapeData_(str) {
    return str
      .replace(/[\\]/g, "\\\\")
      .replace(/[\"]/g, '\\"')
      .replace(/[\/]/g, "\\/")
      .replace(/[\b]/g, "\\b")
      .replace(/[\f]/g, "\\f")
      .replace(/[\n]/g, "\\n")
      .replace(/[\r]/g, "\\r")
      .replace(/[\t]/g, "\\t");
  }
}

function getDrafts() {
  let drafts = GmailApp.getDrafts();

  drafts = drafts.map((el) => {
    return {
      subject: el.getMessage().getSubject(),
      messagePlain: el.getMessage().getPlainBody(),
      messageHTML: el.getMessage().getBody(),
    };
  });

  drafts.push({ subject: "Blank", messagePlain: "", messageHTML: "" });

  return drafts;
  // Logger.log(drafts);
}
