({
  saveRecord: function (component, resolve, reject) {
    const helper = this;
    try {
      const fileId = component.get("v.fileId");
      const fileContents = fileId
        ? window.btoa(localStorage.getItem(fileId))
        : component.get("v.fileContents");
      const recordId = component.get("v.recordId");
      const fileName = component.get("v.fileName");
      component.set("v.fileFields.Title", fileName);
      component.set("v.fileFields.PathOnClient", fileName);
      component.set("v.fileFields.VersionData", fileContents);
      if (recordId)
        component.set("v.fileFields.FirstPublishLocationId", recordId);
      component.find("fileUploader").saveRecord(function (result) {
        if (result.state === "SUCCESS") {
          console.log("successfully saved file.");
          resolve();
        } else {
          console.error("Failed to save record ", result.error);
          reject();
        }
      });
    } catch (ex) {
      reject();
    } finally {
      helper.clearStorage(component);
    }
  },
  clearStorage: function (component) {
    const fileId = component.get("v.fileId");
    if (fileId) localStorage.removeItem(fileId);
  }
});
