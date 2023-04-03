import { useContext } from 'react'
import GenInputContext from './GenInputContext'

function DownloadFile() {
  const date = new Date()
  const months = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ]

  const { batchIDs } = useContext(GenInputContext)

  const downloadExcelFile = () => {
    let uniqueBatchIds = new Set()
    fetch(`${window.REACT_APP_BACKEND_URL}/download`).then((response) => {
      // fetch(`${process.env.REACT_APP_BACKEND_URL}/download`).then((response) => {
      response.blob().then((blob) => {
        let url = window.URL.createObjectURL(blob)
        let a = document.createElement('a')
        let today = `${
          months[date.getMonth()]
        }-${date.getDate()}-${date.getFullYear()}`
        for (let i = 0; i < batchIDs.length; i++) {
          uniqueBatchIds.add(batchIDs[i])
        }
        let filenames = Array.from(uniqueBatchIds).join('__')
        console.log(filenames)
        a.href = url
        a.download = `file-mapping-${filenames}--${today}.xlsx`
        a.click()
      })
      //window.location.href = response.url;
    })
  }

  return (
    <div id='download-div'>
      <h3>Download File Mapping</h3>
      <button onClick={downloadExcelFile}>Download</button>
    </div>
  )
}

export default DownloadFile
