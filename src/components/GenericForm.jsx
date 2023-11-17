/* Foreign dependencies */
import React, { useEffect, useState } from "react";
import { Form, Image } from "react-bootstrap";

/* Local dependencies */
import FormFields from "./FormFields";
import ComboBox from "./ComboBox";
import Select from "./Select";
import FormAccordion from "./FormAccordion/FormAccordion";
import { useData } from "../core/dataContext";
import { useNotification } from "../core/notificationContext";


export default function GenericForm({
    id = ''
    , title = ''
    , tableName
    , inputFields = []
    , avoidColumns = ['id', 'created_at', 'updated_at']
    , customInputs = {'type': <Select tableName={tableName}/>}
    , imgSrc = ''
    
    , searchPattern = '^([a-zA-Z0-9]{1,})$'
    , editMode = false
}) {
    const dataContext = useData();
    const notificationContext = useNotification();

    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({});


    useEffect(() => {   
        retrieveData();
    }, []);

    const retrieveData = async () => {
        const { response, json } = await dataContext.fetchData(tableName, {}, {}, false, true);

        if(response.status === 200) {
            setData(json);

            const newFormData = {};
            Object.keys(json[0]).map((key) => {
                if(avoidColumns.includes(key)) return;

                if(Object.keys(customInputs).includes(key)) {
                    return newFormData[key] = formData[key] || '';
                }

                return newFormData[key] = '';
            })

            setFormData(newFormData);
        }
    }


    /* Handlers */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(Object.values(formData).includes('')) {
            notificationContext.spawnToast({
                title: 'Warning'
                , message: 'Please fill all the fields.'
                , variant: 'warning'
            })
            return;
        }

        await dataContext.submitData(tableName, formData);
        retrieveData();

        const firstInput = document.getElementById(`${tableName}-generic-form-input-${inputFields[0]}`);
        firstInput.focus();
    }

    const handleDelete = async (option) => {
        const response = await dataContext.deleteData(tableName, {id: [option[`id`]]});
        retrieveData();

        return response;
    }


    /* Events */
    const onInputChange = (e, key) => {
        const newFormData = {...formData};
        newFormData[key] = e.target.value;
        setFormData(newFormData);
    }

    
    return (<>
        <Form className='generic-form'>
    
            <Image id={id} className={`generic-form-image`} src={imgSrc} />
            
            <h2 className={`generic-form-title`}>
                {title.charAt(0).toUpperCase() + title.slice(1)}
            </h2>
    
            <FormFields
                tableName={tableName}
                formData={formData}
                inputFields={inputFields}
                customInputs={customInputs}
                avoidColumns={avoidColumns}
                onInputChange={onInputChange}
            />
    
            {data.length > 0 &&
            <FormAccordion
                tableName={tableName}
                dataLength={data.length}
                inputFields={inputFields}
                onSubmit={handleSubmit}
                >
                <ComboBox 
                    data={data}
                    avoidColumns={avoidColumns}
                    pattern={searchPattern}
                    editMode={editMode}
                    
                    onOptionClick={(e) => {console.log(e)}}
                    onQuantityChange={(e) => {console.log(e)}}
                    onDelete={handleDelete}
                    />
            </FormAccordion>}

            {data.length < 0 && <div className="FormAccordion-text">
                    No entries found.
            </div>}

    </Form>

    </>)
}