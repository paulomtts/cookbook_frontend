/* Foreign dependencies */
import React, { useEffect, useState } from "react";
import { Form, Image } from "react-bootstrap";

/* Local dependencies */
import FormFields from "../FormFields/FormFields";
import ComboBox from "../ComboBox/ComboBox";
import FormAccordion from "../FormAccordion/FormAccordion";
import { useNotification } from "../../core/notificationContext";
import { useData } from "../../core/dataContext";
import './GenericForm.css';

export default function GenericForm({
    tableName
    , fields = []
    , avoid = ['id', 'created_at', 'updated_at']
    , pattern = '^([a-zA-Z0-9]{1,})$'
        
    , title = ''
    , imgSrc = ''

    , customInputs = {}
}) {

    const notificationContext = useNotification();
    const dataContext = useData();

    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({});
    
    
    /* Effects */
    useEffect(() => {   
        retrieveData();
    }, []);

    useEffect(() => {
        if (fields.length === 0) return;
        setupFormData();
    }, [fields]);


    /* Setup */
    const retrieveData = async () => {
        const { json } = await dataContext.fetchData(tableName, {}, {}, false, true);
        setData(json);
    }

    const setupFormData = () => {
        const newFormData = fields.reduce((acc, key) => {
            return {...acc, [key]: ''};
        }, {});
        setFormData(newFormData);
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

        const fieldName = fields[0];
        const firstInput = document.getElementById(`${tableName}-form-input-${fieldName}`);
        firstInput.focus();
    }

    const handleDelete = async (row) => {
        const response = await dataContext.deleteData(tableName, {id: [row[`id`]]});
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
        <Form className='GenericForm'>
    
            <Image className={`GenericForm-image`} src={imgSrc} />
            
            <h2 className={`GenericForm-title`}>
                {title.charAt(0).toUpperCase() + title.slice(1)}
            </h2>
    
            <div className="GenericForm-container">

                <div className="GenericForm-body-container">
                    {Object.keys(formData).length > 0 &&
                        <FormFields
                            tableName={tableName}
                            fields={fields}
                            formData={formData}
                            customInputs={customInputs}
                            onInputChange={onInputChange}
                        />
                    }
                </div>
        
                <div className="GenericForm-footer-container">
                    {data.length > 0 &&
                        <FormAccordion
                            tableName={tableName}
                            dataLength={data.length}
                            inputFields={fields}
                            onSubmit={handleSubmit}
                        >
                            <ComboBox 
                                data={data}
                                avoid={avoid}
                                pattern={pattern}
                                editable
                                footer
                                
                                onClickDelete={handleDelete}
                            />
                        </FormAccordion>
                    }
                </div>
            </div>

            {data.length < 0 && <div className="FormAccordion-text">
                No entries found.
            </div>}

    </Form>

    </>)
}