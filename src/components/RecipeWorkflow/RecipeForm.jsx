/* Foreign dependencies */
import React, { useContext } from "react";
import { Form } from "react-bootstrap";

/* Local dependencies */
import { RecipeContext } from "./Recipe";
import FormFields from "../FormFields/FormFields";
import FormButton from "../FormButton/FormButton";
import Select from "../Select";

import './Recipe.css';



export default function RecipeForm({
    onNext = () => {}
}) {

    const { 
        fields
        , formData
        , setFormData
        , selectCategoriesData
        , selectPeriodsData
        , selectPresentationsData
    } = useContext(RecipeContext);
    
    /* Handlers */
    const handleInputChange = (value, key) => {
        const newFormData = {...formData};
        newFormData[key] = value;
        setFormData(newFormData);
    }

    return (<>   
        <span className={`GenericForm-description`}>
            Fill in the fields below to start creating a new recipe!
        </span>
        
        <FormFields
            tableName="recipes"
            fields={fields}
            formData={formData}
            customInputs={{ 
                'description': <Form.Control as="textarea" rows={3} />
                , 'type': 
                    <Select
                        data={selectCategoriesData}
                        targetField='name'
                        value={formData['type']}
                    />
                , 'timing':
                    <Select
                        data={selectPeriodsData}
                        targetField='name'
                        value={formData['period']}
                    />
                , 'course':
                    <Select
                        data={selectPresentationsData}
                        targetField='name'
                        value={formData['presentation']}
                    />
            }}
            onInputChange={(value, key) => handleInputChange(value, key)}
        />

        <div className="flex justify-between align-center" style={{marginBottom: '0.25rem'}}>
            <div style={{visibility: 'hidden', margin: '0px 5px'}}>Next</div>

            <div className="flex gap-3 justify-center align-center">
                <div className={"Step-badge-filled"}>
                    <span>1</span>
                </div>

                <span className="Dots">. . .</span>

                <div className={"Step-badge"}>
                    <span>2</span>
                </div>

                <span className="Dots">. . .</span>
                
                <div className={"Step-badge"}>
                    <span>3</span>
                </div>
            </div>

            <FormButton
                tableName="recipes"
                inputFields={fields}
                onClick={() => onNext()}
            >
                Next
            </FormButton>
        </div>
    </>);
}