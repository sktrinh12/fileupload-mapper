import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import DownloadFile from "./Download";

function Dropzone() {
  const [project, setProject] = useState("");
  const [cro, setCRO] = useState("");
  const [showDownBtn, setShowDownBtn] = useState(false);
  const [fileNames, setFileNames] = useState([]);

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
        {file.path} - {file.size} bytes
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
    if (acceptedFiles.length === 0 && !project && !cro) return;
    let formData = new FormData();
    for (let file of acceptedFiles) {
      formData.append("files", file);
    }

    // console.log(project);
    // console.log(cro);
    formData.append("project", project);
    formData.append("cro", cro);

    // fetch("https://httpbin.org/post",
    fetch(`${process.env.REACT_APP_BACKEND_URL}/upload`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.status);
        setFileNames(data.contents);
      })
      .catch((error) => {
        console.error(error);
      });

    setShowDownBtn(true);
  };

  return (
    <div className="container">
      <div className="input-zone" {...getRootProps()}>
        <input {...getInputProps()} />
        <h2>
          <p>Drag 'n' drop some files here, or click to select files</p>
        </h2>
        <em>
          <p>
            Please ensure the set of files only has one FT number, do not mix
            and match.
          </p>

          <p>
            Also, can only execute a set of files at a time. Cannot execute
            consectutively added files.
          </p>
        </em>
        <em>(Only *.jpeg, *.png, *.pdf files will be accepted)</em>
      </div>
      {acceptedFiles.length > 0 && (
        <>
          <h4>Accepted files</h4>
          <ul>{acceptedFileItems}</ul>
          <div>
            <label>
              <b>PROJECT</b>
              <input
                id="project-id"
                type="text"
                placeholder="Enter project"
                onChange={(e) => {
                  setProject(e.target.value);
                }}
              />
            </label>
            <label>
              <b>CRO</b>
              <input
                id="cro-id"
                type="text"
                placeholder="Enter CRO"
                onChange={(e) => {
                  setCRO(e.target.value);
                }}
              />
            </label>
          </div>
          <button style={{ marginTop: "12px" }} onClick={handleUpload}>
            Submit
          </button>

          {showDownBtn && <DownloadFile filenames={fileNames} />}
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
