/* Foreign dependencies */
import React, { useContext } from 'react';
import { Table } from 'react-bootstrap';

/* Local dependencies */
import { ComboBoxContext } from '../ComboBox';
import TableHeader from './TableHeader';
import TableBody from './TableBody';

export default function ComboBoxTable() {
    const { containerRef, tableContainerClassName } = useContext(ComboBoxContext);
    
    return (<>
        <div ref={containerRef} className={`ComboBox-table-container ${tableContainerClassName}`}>
            <Table hover size="sm" className="ComboBox-table">
                <TableHeader />
                <TableBody />
            </Table>
        </div>
    </>)
}