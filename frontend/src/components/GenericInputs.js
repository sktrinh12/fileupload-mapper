import { useContext } from 'react'
import GenInputContext from './GenInputContext'

const GenericInput = ({ xlsxFiles }) => {
  const {
    cro,
    project,
    handleChangeCRO,
    handleChangeProj,
    batchIDs,
    fileNames,
  } = useContext(GenInputContext)
  const hasPdf = fileNames.some((fileName) => fileName.endsWith('.pdf'))

  return xlsxFiles.length > 0
    ? batchIDs.length > 0 && (
        <table>
          <tbody>
            {batchIDs.map((b, i) => (
              <tr key={`batch_${i}`}>
                <td>
                  {/*<input
                    type='text'
                    value={b}
                    onChange={(e) => handleBatchIDChange(i, e.target.value)}
                  />
								*/}
                  {b}
                </td>
                <td>{fileNames[i]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    : hasPdf && (
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
            <input
              id='cro-id'
              type='text'
              value={cro}
              onChange={handleChangeCRO}
            />
          </label>
        </>
      )
}

export default GenericInput
