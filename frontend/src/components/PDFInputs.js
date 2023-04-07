import { useContext } from 'react'
import GenInputContext from './GenInputContext'

const PDFInputs = () => {
  const { cro, project, handleChangeCRO, handleChangeProj } =
    useContext(GenInputContext)
  return (
    <>
      <label>
        <b>Project</b>
        <input
          id='project-id'
          type='text'
          value={project}
          onChange={handleChangeProj}
        />
      </label>
      <label>
        <b>CRO</b>
        <input id='cro-id' type='text' value={cro} onChange={handleChangeCRO} />
      </label>
    </>
  )
}

export default PDFInputs
