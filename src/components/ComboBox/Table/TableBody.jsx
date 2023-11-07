/* Foreign dependencies */
import React, { useContext } from "react";

/* Local dependencies */
import { ComboBoxContext } from "../ComboBox";
import TableRow from "./TableRow";

export default function TableBody() {
    const { data, checkDisplayConditions } = useContext(ComboBoxContext);

    return(<>
        <tbody>
            {data.map((row, index) => {
                if(!checkDisplayConditions(row)) return null;

                return (
                <TableRow
                    key={`option-${index}`}
                    row={row}
                    index={index}
                />)
            })}
        </tbody>
    </>)
}