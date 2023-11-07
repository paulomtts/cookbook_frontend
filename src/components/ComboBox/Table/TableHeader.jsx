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
                    if(key === 'quantity') return null;
                    return <th
                        key={`option-${index}`}
                        className="ComboBox-table-header"
                    >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                    </th>
                })}

                {quantities && <th className='ComboBox-table-header' style={{width: '12%'}}>Quantity</th>}

            </tr>
        </thead>
    </>)
}