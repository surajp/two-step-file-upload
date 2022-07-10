import { LightningElement, api } from "lwc";
import { FlowAttributeChangeEvent } from "lightning/flowSupport";

const MAX_FILE_SIZE_MB = 2.2;
export default class FileUploadLocal extends LightningElement {
  _fileContents = "";
  _fileName = "";
  errMsg = "";

  @api
  useLocalStorage = false;

  _fileId = "";

  @api
  get fileId() {
    return this._fileId;
  }

  @api
  get fileContents() {
    return this._fileContents;
  }

  @api
  get fileName() {
    return this._fileName;
  }

  @api
  availableActions = [];

  _handleUsingString = (evt) => {
    this._fileContents = btoa(evt.target.result);
    const attrChangeEvent = new FlowAttributeChangeEvent(
      "fileContents",
      this.fileContents
    );
    this.dispatchEvent(attrChangeEvent);
  };

  _handleUsingLocalStorage = (evt) => {
    const uuid = "file-" + ~~(Math.random() * 10000);
    try {
      localStorage.setItem(uuid, evt.target.result);
    } catch (err) {
      console.error("saving file to local storage failed", err);
      return;
    }
    this._fileId = uuid;
    const attrChangeEvent = new FlowAttributeChangeEvent("fileId", this.fileId);
    console.log("attribute change event fired for file id " + this.fileId);
    this.dispatchEvent(attrChangeEvent);
  };

  handleUpload(evt) {
    this.errMsg = "";
    let file = evt.target.files[0];
    if (!this.validateSize(file.size)) {
      this.template.querySelector("input.file").value = null;
      return;
    }
    let reader = new FileReader();
    reader.onload = this.useLocalStorage
      ? this._handleUsingLocalStorage
      : this._handleUsingString;
    reader.readAsBinaryString(evt.target.files[0]);
    this._fileName = evt.target.files[0].name;
    const attrChangeEvent = new FlowAttributeChangeEvent(
      "fileName",
      this.fileContents
    );
    this.dispatchEvent(attrChangeEvent);
  }

  validateSize(size) {
    if ((size / 1024 / 1024).toFixed(1) > MAX_FILE_SIZE_MB) {
      this.errMsg = `Only files upto ${MAX_FILE_SIZE_MB} MB in size are supported`;
      return false;
    }
    return true;
  }
}
