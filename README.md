# Two-step file upload in Flows

## Motivation

Salesforce provides `lighting-file-upload` and flow screen elements for uploading files. However, these upload the files to Salesforce immediately in a single step. As a result, if the flow is abandoned or errors out unexpectedly, the uploaded files stay in the system and take up file storage space for no reason. You may also want to add the file upload step to the same screen as the one where the user is entering the new record details. This gets cumbersome because now after the record and the `ContentDocument` are created you have to now create a new `ContentDocumentLink` in a separate step.

## Contents

This repository contains an LWC called `fileUploadLocal` and an Aura Local Action called `fileUploadServer` which make uploading a file a two-step process.

### Uploading files locally

The first lwc may be used to upload files "locally" and store the contents within a flow variable or your browser's `localStorage`. Storing within a flow variable allows the user to pause the flow and resume later without losing the file contents. However, depending on the size of the file, this can slow down your flow quite a bit.
Using `localStorage` on the other hand makes the flow go much faster. However, if the flow is paused, the file contents may be, and most likely will be, lost.

### Uploading files to Salesforce

The aura local action (`fileUploadServer`) uploads the file to Salesforce as a new `ContentDocument`. You can, optionally, specify the record Id of the file's parent record. You may also choose to automatically advance to the next step after the file upload is complete.

## Benefits

Since this, essentially, makes file upload to a 2-step process, if the flow errors out or user closes their browser, you aren't left with lingering irrelevant files in your org that needs cleaned up. You can also add the file upload component to the record creation screen and then down the line use `fileUploadServer` to upload the file to your org and specify the record id of the new record. This eliminates a separate step of creating a `ContentDocumentLink`.

## Note

- The maximum size of files that can be uploaded is a little over 2MB due to the character limit of size of a single request to an `@AuraEnabled` Apex method. For this reason, the maximum file size limit for this component has been set to 2.2 MB
- Currently, multiple file uploads are not supported.
