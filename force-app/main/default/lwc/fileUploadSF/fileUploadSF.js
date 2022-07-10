import { LightningElement, api } from "lwc";
import {
  FlowNavigationNextEvent,
  FlowNavigationFinishEvent
} from "lightning/flowSupport";
import { createRecord } from "lightning/uiRecordApi";
import reduceErrors from "./reduceErrors.js";

export default class FileUploadSF extends LightningElement {
  @api
  title = "FlowFileUpload.txt";

  @api
  fileContents;

  errMsg = "";

  @api
  fileId;

  @api
  recordId;

  @api
  availableActions = [];

  @api
  autoAdvance = false;

  processing = false;

  async connectedCallback() {
    await this.createCv();
  }

  clearLocalStorage() {
    if (this.fileId) {
      localStorage.removeItem(this.fileId);
    }
  }

  async createCv() {
    try {
      const fileData = {
        Title: this.title,
        PathOnClient: this.title,
        VersionData: this.fileId
          ? window.btoa(localStorage.getItem(this.fileId))
          : this.fileContents,
        Description: "Uploaded from Flow File Uploader"
      };
      if (this.recordId) fileData.FirstPublishLocationId = this.recordId;
      const payload = { apiName: "ContentVersion", fields: fileData };
      this.processing = true;
      const resp = await createRecord(payload);
      if (resp.error) {
        throw Error(resp.error.body.message);
      }
      this.clearLocalStorage();
      if (this.autoAdvance) {
        this.handleGoNext();
      }
    } catch (err) {
      console.error("An error occured ", err);
      this.errMsg = reduceErrors(err).join("\n");
    } finally {
      this.processing = false;
    }
  }

  handleGoNext() {
    // check if NEXT is allowed on this screen
    if (this.availableActions.find((action) => action === "NEXT")) {
      // navigate to the next screen
      const navigateNextEvent = new FlowNavigationNextEvent();
      this.dispatchEvent(navigateNextEvent);
    } else if (this.availableActions.find((action) => action === "FINISH")) {
      // navigate to the next screen
      const navigateFinishEvent = new FlowNavigationFinishEvent();
      this.dispatchEvent(navigateFinishEvent);
    }
  }
}
