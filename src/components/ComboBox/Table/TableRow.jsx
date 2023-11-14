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
        , customColumns
        , selectable
        , editable
        , quantities
        , lock
        , quantitiesData
        , selectedRows
        , handleClickRow
        , handleClickDelete
        , handleQuantityChange
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

                if (Object.keys(customColumns).includes(key)) {
                    return <td key={`option-${idx}`} className="ComboBox-table-row-data" style={{ cursor: lock ? 'default' : 'pointer' }} onClick={() => handleClickRow(row)}>
                        {React.cloneElement(customColumns[key], { row })}
                    </td>
                }

                if (quantities && Object.keys(quantitiesData).length > 0 && key === 'quantity') {
                    return <td key={`option-${idx}`} style={{verticalAlign: 'middle', padding: '0px'}}>
                    <Form.Control
                        className="ComboBox-quantity-input"
                        id={`quantity-${index}`}
                        type="number"
                        disabled={lock}
                        min={0}
                        value={quantitiesData[row['id']]}
                        onChange={(e) => handleQuantityChange(row, parseInt(e.target.value))}
                        style={{ backgroundColor: (editable ? lock : true) ? 'transparent' : 'white' }}
                    />
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