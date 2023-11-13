/* Foreign dependencies */
import React, { useContext, useEffect, useState } from "react";

/* Local dependencies */
import { ComboBoxContext } from "../ComboBox";
import { useVirtualizedList } from "../../../hooks/useVirtualizedList";

import TableRow from "./TableRow";

export default function TableBody() {
    const { data, display, searchFor, rowHeight, containerRef, checkDisplayConditions } = useContext(ComboBoxContext);

    // const [filteredData, setFilteredData] = useState([]);

    const rowBuilder = (row) => {
        return <TableRow key={`option-${row['id']}`} row={row} index={row[`id`]} />
    }

    // useEffect(() => {
    //     const newFilteredData = data.reduce((acc, row) => {
    //         if (checkDisplayConditions(row)) acc.push(row);
    //         return acc;
    //     }, []);


    //     setFilteredData(newFilteredData);
    //     console.log(newFilteredData);
    // }, [searchFor, display]);


    // const [
    //     visibleData
    //     , prevHeight
    //     , postHeight
    // ] = useVirtualizedList(filteredData, checkDisplayConditions, rowHeight, containerRef, 8, 4);

    const [
        visibleData
        , prevHeight
        , postHeight
    ] = useVirtualizedList(data, checkDisplayConditions, rowBuilder, [searchFor, display], containerRef, rowHeight, 8, 4);

    return(<>
        <tbody>
            {display === 'all' &&
                <tr key={`option-prev`} style={{height: `${prevHeight}px`}} />
            }

            {/* {filteredData.reduce((acc, row) => {
                if(visibleData.includes(row)) acc.push(
                    <TableRow
                        key={`option-${row[`id`]}`}
                        row={row}
                        index={row[`id`]}
                    />
                );
                return acc;

            }, [])} */}
            {visibleData}
            {display === 'all' &&
                <tr key={`option-post`} style={{height: `${postHeight}px`}} />
            }
        </tbody>
    </>)
}