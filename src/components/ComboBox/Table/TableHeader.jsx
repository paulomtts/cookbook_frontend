/* Foreign dependencies */
import React, { useContext } from 'react';

/* Local dependencies */
import { ComboBoxContext } from '../ComboBox';


export default function TableHeader() {

    const { fields, rename } = useContext(ComboBoxContext);

    return (<>
        <thead style={{position: 'sticky', top: '0px', zIndex: '1', backgroundColor: 'white'}} >
            <tr>
                <th className='ComboBox-table-header' style={{width: '4%'}}></th>
                
                {fields.map((key, index) => {
                    return <th
                        key={`option-${index}`}
                        className={`ComboBox-table-header ComboBox-table-${key}-header`}
                    >
                        {Object.keys(rename).includes(key) ? 
                            rename[key].charAt(0).toUpperCase() + rename[key].slice(1)
                            : 
                            key.charAt(0).toUpperCase() + key.slice(1)}
                    </th>
                })}
            </tr>
        </thead>
    </>)
}