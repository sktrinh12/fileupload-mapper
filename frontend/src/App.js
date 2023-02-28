import React, { useState } from 'react'
import Dropzone from './components/Dropzone'
import GenInputContext from './components/GenInputContext'
import './App.css'

const initProj = 'KIN-'
const initCRO = 'Pharmaron'

function App() {
  const [project, setProject] = useState(initProj)
  const [cro, setCRO] = useState(initCRO)
  const [showDownBtn, setShowDownBtn] = useState(false)
  const [fileNames, setFileNames] = useState([])
  const [isDisabled, setIsDisabled] = useState(false)
  const [batchIDs, setBatchIDs] = useState([])

  const handleChangeProj = (e) => {
    setProject(e.target.value)
  }
  const handleChangeCRO = (e) => {
    setCRO(e.target.value)
  }

  const handleResetDropzone = () => {
    setShowDownBtn(false)
    setProject(initProj)
    setCRO(initCRO)
    setFileNames([])
    setBatchIDs([])
    setIsDisabled(false)
    console.log('reset')
  }

  // const handleBatchIDChange = (index, newValue) => {
  //   setBatchIDs(batchIDs.map((b, i) => (i === index ? newValue : b)))
  // }

  const handleUpload = (e, acceptedFiles) => {
    if (acceptedFiles.length === 0 && !project && !cro) return
    let formData = new FormData()
    for (let file of acceptedFiles) {
      formData.append('files', file)
    }

    formData.append('project', project)
    formData.append('cro', cro)
    // console.log(project);
    // console.log(cro);

    fetch(`${window.REACT_APP_BACKEND_URL}/upload`, {
      mode: 'cors',
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        if (data.file_names) {
          setFileNames(data.file_names)
          setShowDownBtn(true)
          setIsDisabled(true)
          setBatchIDs(data.batch_ids)
        } else {
          setShowDownBtn(false)
          setFileNames(['NONE'])
        }
      })
      .catch((error) => {
        console.error(error)
        alert(`Error uploading files. ${error.slice(0, 30)} ...`)
      })
  }

  return (
    <GenInputContext.Provider
      value={{
        cro,
        project,
        handleChangeProj,
        handleChangeCRO,
        batchIDs,
        fileNames,
      }}
    >
      <div className='App'>
        <Dropzone
          showDownBtn={showDownBtn}
          handleResetDropzone={handleResetDropzone}
          fileNames={fileNames}
          handleUpload={handleUpload}
          isDisabled={isDisabled}
        />
      </div>
    </GenInputContext.Provider>
  )
}

export default App
