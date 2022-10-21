function DownloadFile(props) {
  const date = new Date();
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const DownloadExcelFile = () => {
    fetch(`${window.REACT_APP_BACKEND_URL}/download`).then((response) => {
      // fetch(`${process.env.REACT_APP_BACKEND_URL}/download`).then((response) => {
      response.blob().then((blob) => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        let today = `${
          months[date.getMonth()]
        }-${date.getDate()}-${date.getFullYear()}`;
        let filenames = props.filenames
          .map((f) => {
            return f.split(".")[0];
          })
          .join("__");
        a.href = url;
        a.download = `file-mapping-${filenames}--${today}.xlsx`;
        a.click();
      });
      //window.location.href = response.url;
    });
  };

  return (
    <div id="download-div">
      <h3>Download File Mapping</h3>
      <button onClick={DownloadExcelFile}>Download</button>
    </div>
  );
}

export default DownloadFile;
