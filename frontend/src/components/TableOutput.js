import { useContext } from 'react'
import GenInputContext from './GenInputContext'

const TableOutput = ({ xlsxFiles }) => {
  const { batchIDs, fileNames } = useContext(GenInputContext)

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
    : null
}

export default TableOutput
