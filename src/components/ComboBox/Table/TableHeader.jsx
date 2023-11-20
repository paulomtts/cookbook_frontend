/* Foreign dependencies */
import React, { useContext } from 'react';

/* Local dependencies */
import { ComboBoxContext } from '../ComboBox';


export default function TableHeader() {

    const { fields } = useContext(ComboBoxContext);

    return (<>
        <thead style={{position: 'sticky', top: '0px', zIndex: '1', backgroundColor: 'white'}} >
            <tr>
                <th className='ComboBox-table-header' style={{width: '4%'}}></th>
                
                {fields.map((key, index) => {
                    return <th
                        key={`option-${index}`}
                        className={`ComboBox-table-header ComboBox-table-${key}-header`}
                    >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                    </th>
                })}
            </tr>
        </thead>
    </>)
}