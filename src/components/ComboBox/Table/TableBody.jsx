/* Foreign dependencies */
import React, { useContext } from "react";

/* Local dependencies */
import { ComboBoxContext } from "../ComboBox";
import { useVirtualizedList } from "../../../hooks/useVirtualizedList";

import TableRow from "./TableRow";

export default function TableBody() {
    const { data, display, searchFor, selectedRowsTrigger, containerRef, checkDisplay } = useContext(ComboBoxContext);

    const rowBuilder = (row) => {
        return <TableRow key={`option-${row['id']}`} row={row} index={row[`id`]} />
    }

    const [
        visibleData
        , prevHeight
        , postHeight
    ] = useVirtualizedList(data, checkDisplay, rowBuilder, [searchFor, display, selectedRowsTrigger], containerRef, 36, 8, 4);

    return(<>
        <tbody>
            {display === 'all' && <tr key={`option-prev`} style={{height: `${prevHeight}px`}} />}
            {visibleData}
            {display === 'all' && <tr key={`option-post`} style={{height: `${postHeight}px`}} />}
        </tbody>
    </>)
}