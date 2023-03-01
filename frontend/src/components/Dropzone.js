import { useDropzone } from 'react-dropzone'
import DownloadFile from './Download'
import GenericInputs from './GenericInputs'

console.log('backend url is: ' + window.REACT_APP_BACKEND_URL)

function Dropzone({
  showDownBtn,
  fileNames,
  handleResetDropzone,
  handleUpload,
  isDisabled,
}) {
  const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
    useDropzone({
      accept: {
        'image/jpeg': ['.jpeg', '.png'],
        'text/html': ['.pdf'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
          '.xlsx',
        ],
      },
      onDrop: handleResetDropzone,
    })

  const acceptedFileItems = acceptedFiles.map((file) => {
    // console.log(file.path);
    return (
      <li key={file.path}>
        {file.path} - {file.size} bytes
      </li>
    )
  })

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
    )
  })

  const xlsxFiles = acceptedFiles.filter((file) => file.name.endsWith('.xlsx'))
  // console.log(xlsxFiles)

  return (
    <div className='container'>
      <div className='input-zone' {...getRootProps()}>
        <input {...getInputProps()} />
        <h2>
          <p>Drag 'n' drop some files here, or click to select files</p>
        </h2>
        <em>
          <p>
            For <code>Analytical Chem Files</code>, please ensure the set of
            files only has one FT number, do not mix and match.
          </p>
          <p>
            For <code> .xlsx </code> files, it is possible to mix and match
            since it will parse the actual file.
          </p>
          <p>
            Only able to execute a set of files at a time; cannot execute
            consecutively added files.
          </p>
        </em>
        <em>
          <code> *.jpeg, *.png, *.pdf, *.xlsx</code> files will be accepted
        </em>
      </div>
      {acceptedFiles.length > 0 && (
        <>
          <h4>Accepted files</h4>
          <ul>{acceptedFileItems}</ul>
          <GenericInputs xlsxFiles={xlsxFiles} />
          <button
            style={{ marginTop: '12px' }}
            onClick={(e) => handleUpload(e, acceptedFiles)}
            disabled={isDisabled}
          >
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
  )
}

export default Dropzone
