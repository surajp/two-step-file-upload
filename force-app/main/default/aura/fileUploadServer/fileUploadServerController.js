({
  invoke: function (component, event, helper) {
    return new Promise((resolve, reject) => {
      try {
        component.find("fileUploader").getNewRecord(
          "ContentVersion",
          null,
          false,
          $A.getCallback(() => {
            helper.saveRecord(component, resolve, reject);
          })
        );
      } catch (ex) {
        reject("An error occured " + ex.message);
      }
    });
  }
});
