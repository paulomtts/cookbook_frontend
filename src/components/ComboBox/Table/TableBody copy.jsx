/* Foreign dependencies */
import React, { useContext, useEffect, useState } from "react";

/* Local dependencies */
import { ComboBoxContext } from "../ComboBox";
import { useVirtualizedList } from "../../../hooks/useVirtualizedList";

import TableRow from "./TableRow";

export default function TableBody() {
    const { data, display, searchFor, rowHeight, containerRef, checkDisplayConditions } = useContext(ComboBoxContext);

    const rowBuilder = (row) => {
        return <TableRow key={`option-${row['id']}`} row={row} index={row[`id`]} />
    }

    const [
        visibleData
        , prevHeight
        , postHeight
    ] = useVirtualizedList(data, checkDisplayConditions, rowBuilder, [searchFor, display], containerRef, rowHeight, 8, 4);

    return(<>
        <tbody>
            {display === 'all' && <tr key={`option-prev`} style={{height: `${prevHeight}px`}} />}
            {visibleData}
            {display === 'all' && <tr key={`option-post`} style={{height: `${postHeight}px`}} />}
        </tbody>
    </>)
}