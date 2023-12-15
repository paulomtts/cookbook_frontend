/* Foreign dependencies */
import React, { useContext } from "react";
import { Form } from "react-bootstrap";

/* Local dependencies */
import { RecipeContext } from "./Recipe";
import FormButton from "../FormButton/FormButton";
import Select from "../Select";
import ComboBox from "../ComboBox/ComboBox";
import FormFields from "../FormFields/FormFields";

import './Recipe.css';


export default function RecipeReview({
    onPrevious = () => {}
    , onSubmit = () => {}
}) {

    const { 
        fields
        , formData
        , unitData
        , recipeIngredientSelectedRows
        , recipeIngredientCustomData
        , selectCategoriesData
        , selectPeriodsData
        , selectPresentationsData
    } = useContext(RecipeContext);

    return (<>  
        <span className={`GenericForm-description`}>
            Here's a summary of your recipe! If you want to change anything, click on the "Previous" button to go back.
        </span>

        <FormFields
            tableName="recipes"
            readOnly
            fields={fields}
            formData={formData}
            customInputs={{ 
                'description': <Form.Control as="textarea" rows={3} disabled/>
                , 'type': 
                    <Select
                        data={selectCategoriesData}
                        targetField='name'
                        value={formData['type']}
                        disabled
                        />
                        , 'timing':
                    <Select
                        data={selectPeriodsData}
                        targetField='name'
                        value={formData['period']}
                        disabled
                    />
                , 'course':
                    <Select
                        data={selectPresentationsData}
                        targetField='name'
                        value={formData['presentation']}
                        disabled
                    />
            }}
            onInputChange={(value, key) => handleInputChange(value, key)}
        />

        <ComboBox
            pattern='^([a-zA-Z0-9]{1,})$'
            avoid={['id', 'id_recipe_ingredient', 'id_recipe', 'id_ingredient', 'unit', 'created_at', 'updated_at', 'description']}
            rename={{'id_unit': 'unit'}}
            footer

            avoidSearch={['quantity', 'id_unit']}
            
            data={recipeIngredientSelectedRows}
            initialCustomData={recipeIngredientCustomData}

            customComponents={{
                'quantity': {
                    "component": 
                        <Form.Control as="input" type="number" min={0} disabled/>
                    , "defaultValue": 100
                }
                , 'id_unit': {
                    "component": 
                        <Select 
                            data={unitData}
                            showField="name"
                            targetField="id"
                            value={recipeIngredientCustomData['id_unit']}
                            disabled
                        />
                    , "defaultValue": 1
                }
            }}
        />

    <div className="flex justify-between align-center" style={{marginBottom: '0.25rem'}}>
            <FormButton
                outline
                tableName="recipes"
                inputFields={fields}
                onClick={() => onPrevious()}
            >
                Previous
            </FormButton>

            <div className="flex gap-3 justify-center align-center">
                <div className={"Step-badge-filled"}>
                    <span>1</span>
                </div>

                <span className="Dots">. . .</span>

                <div className={"Step-badge-filled"}>
                    <span>2</span>
                </div>

                <span className="Dots">. . .</span>
                
                <div className={"Step-badge-filled"}>
                    <span>3</span>
                </div>
            </div>

            <FormButton
                tableName="recipes"
                inputFields={fields}
                onClick={(e) => {
                    e.preventDefault();
                    onSubmit();
                }}
            >
                Submit
            </FormButton>
        </div>
    </>);
}