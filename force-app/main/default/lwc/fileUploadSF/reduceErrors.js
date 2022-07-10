const reduceErrors = (errors) => {
  if (typeof errors === "string") {
    return [errors];
  }
  if (!Array.isArray(errors)) {
    errors = [errors];
  }

  return (
    errors
      // Remove null/undefined items
      .filter((error) => !!error)
      // Extract an error message
      .map((error) => {
        // UI API read errors
        if (Array.isArray(error.body)) {
          return error.body.map((e) => e.message);
        }
        // FIELD VALIDATION, FIELD, and trigger.addError
        else if (
          error.body &&
          error.body.enhancedErrorType &&
          error.body.enhancedErrorType.toLowerCase() === "recorderror" &&
          error.body.output
        ) {
          let firstError = "";
          if (
            error.body.output.errors.length &&
            error.body.output.errors[0].errorCode.includes("_") // one of the many salesforce errors with underscores
          ) {
            firstError = error.body.output.errors[0].message;
          }
          if (
            !error.body.output.errors.length &&
            error.body.output.fieldErrors
          ) {
            // It's in a really weird format...
            firstError =
              error.body.output.fieldErrors[
                Object.keys(error.body.output.fieldErrors)[0]
              ][0].message;
          }
          return firstError;
        }
        // UI API DML, Apex and network errors
        else if (error.body && typeof error.body.message === "string") {
          let errorMessage = error.body.message;
          if (typeof error.body.stackTrace === "string") {
            errorMessage += `\n${error.body.stackTrace}`;
          }
          return errorMessage;
        }
        // PAGE ERRORS
        else if (error.body && error.body.pageErrors.length) {
          return error.body.pageErrors[0].message;
        }
        // JS errors
        else if (typeof error.message === "string") {
          return error.message;
        }
        // Unknown error shape so try HTTP status text
        return error.statusText;
      })
      // Flatten
      .reduce((prev, curr) => prev.concat(curr), [])
      // Remove empty strings
      .filter((message) => !!message)
  );
};

export default reduceErrors;
