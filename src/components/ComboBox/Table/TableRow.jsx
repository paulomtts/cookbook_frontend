/* Foreign dependencies */
import React, { useContext } from "react";
import { Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

/* Local dependencies */
import { ComboBoxContext } from "../ComboBox";


export default function TableRow({
    row
    , index
}) {

    const {
        fields
        , customComponents
        , selectable
        , editable
        , lock
        , customData
        , selectedRows
        , handleClickRow
        , handleClickDelete
        , handleCustomDataChange
    } = useContext(ComboBoxContext);

    return(<>
        <tr key={`${index}`} className="fade-in">

            {/* Action cell */}
            <td className="ComboBox-table-row-data">
                <div className="ComboBox-table-row-data-container">

                    {selectable && <Form.Check
                        className="ComboBox-checkbox"
                        type="checkbox"
                        disabled={lock}
                        checked={selectedRows.map((selRow) => selRow[`id`]).includes(row[`id`])}
                        onChange={() => handleClickRow(row)}
                    />}

                    {editable && <Button
                        className="ComboBox-delete-button"
                        variant="outline-secondary"
                        size="sm"
                        disabled={lock}
                        onClick={() => handleClickDelete(row)}
                        >
                        <FontAwesomeIcon icon={faTrash}/>
                    </Button>}

                </div>
            </td>

            {/* Data cells */}
            {Object.keys(row).map((key, idx) => {
                if (!fields.includes(key)) return null;

                if (Object.keys(customData).includes(key)) {
                    return <td key={`option-${idx}`} style={{verticalAlign: 'middle', padding: '2px'}}>
                        {React.cloneElement(customComponents[key].component, {
                            className: `ComboBox-${key}-input ComboBox-Select`
                            , id: `${key}-${index}`	
                            , disabled: lock
                            , value: customData[key][row['id']]
                            , onChange: (e) => handleCustomDataChange(row, key, e.target.value)
                        })}
                    </td>  
                }

                return <td 
                    key={`option-${idx}`}
                    className="ComboBox-table-row-data"
                    style={{ cursor: lock ? 'default' : 'pointer', textAlign: ['unit', 'quantity'].includes(key) ? 'center' : 'left' }}
                    onClick={() => handleClickRow(row)}
                >
                    {row[key]}
                </td>
            })}
        </tr>
    </>)
}