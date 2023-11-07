/* Foreign dependencies */
import React, { useContext } from 'react';

/* Local dependencies */
import { ComboBoxContext } from '../ComboBox';   


export default function ComboBoxInfo() {
    const { data, selectedRows } = useContext(ComboBoxContext);

    return (<>
        <span className='ComboBox-footer-span'>
            {selectedRows.length} selected
        </span>
        <span className='ComboBox-footer-span'>
            {data.length} total
        </span>
    </>)
}