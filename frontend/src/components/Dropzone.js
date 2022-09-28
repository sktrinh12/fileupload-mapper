import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

function Dropzone(props) {

  const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
    useDropzone({
      accept: {
        "image/jpeg": [".jpeg", ".png"],
        "text/html": [".pdf"],
      },
    });

  const acceptedFileItems = acceptedFiles.map((file) => {
    // console.log(file.path);
    return (
      <li key={file.path}>
        {file.path} - ${file.size} bytes
      </li>
    );
  });

  const fileRejectionItems = fileRejections.map(({ file, errors }) => {
    return (
      <li key={file.path}>
        {file.path} - ${file.size} bytes
        <ul>
          {errors.map((e) => (
            <li key={e.code}>{e.message}</li>
          ))}
        </ul>
      </li>
    );
  });

  const handleUpload = (event) => {
    // console.log(acceptedFiles);
    if (acceptedFiles.length === 0) return;
    const formData = new FormData();
    for (const file of acceptedFiles) {
      formData.append("uploadFile[]", file);
    }

    fetch("https://httpbin.org/post", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="container">
      <div className="input-zone" {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
        <em>(Only *.jpeg, *.png, *.pdf files will be accepted)</em>
      </div>
      {acceptedFiles.length > 0 && (
        <>
          <h4>Accepted files</h4>
          <ul>{acceptedFileItems}</ul>
          <button onClick={handleUpload}>Submit</button>
        </>
      )}
      {fileRejections.length > 0 && (
        <>
          <h4>Rejected files</h4>
          <ul>{fileRejectionItems}</ul>
        </>
      )}
    </div>
  );
}

export default Dropzone;
