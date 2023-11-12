/* Foreign dependencies */
import React, { useContext } from 'react';

/* Local dependencies */
import { ComboBoxContext } from '../ComboBox';


export default function TableHeader({
    
}) {

    const { fields, quantities } = useContext(ComboBoxContext);

    return (<>
        <thead style={{position: 'sticky', top: '0px', zIndex: '1', backgroundColor: 'white'}} >
            <tr>
                <th className='ComboBox-table-header' style={{width: '4%'}}></th>
                
                {fields.map((key, index) => {
                    return <th
                        key={`option-${index}`}
                        className="ComboBox-table-header"
                        style={{width: `${quantities ? '12%' : 'auto'}`, textAlign: `${['quantity', 'unit'].includes(key) ? 'center' : 'left'}`}}
                    >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                    </th>
                })}
            </tr>
        </thead>
    </>)
}