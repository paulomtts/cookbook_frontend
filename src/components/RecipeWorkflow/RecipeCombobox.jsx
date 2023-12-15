/* Foreign dependencies */
import React, { useContext } from "react";
import { Form } from "react-bootstrap";

/* Local dependencies */
import { RecipeContext } from "./Recipe";
import FormButton from "../FormButton/FormButton";
import Select from "../Select";
import ComboBox from "../ComboBox/ComboBox";

import './Recipe.css';



export default function RecipeCombobox({
    onPrevious = () => {}
    , onNext = () => {}
}) {

    const { 
        fields
        , unitData
        , recipeIngredientData
        , recipeIngredientCustomData, setRecipeIngredientCustomData
        , recipeIngredientSelectedRows, setRecipeIngredientSelectedRows
    } = useContext(RecipeContext);

    /* Handlers */
    const onClickIngredientRow = async (selectedRows, _) => { // reason: ComboBox's onClickRow sends (selectedRows, row)
        setRecipeIngredientSelectedRows(selectedRows);
    }

    const onChangeRecipeIngredientCustomData = (newCustomData) => { // reason: ComboBox's onChangeCustomData sends customData
        setRecipeIngredientCustomData(newCustomData);
    }
    

    return (<>           
        <span className={`GenericForm-description`}>
            Now it's time to add the ingredients! Click on a row to select it, and then fill in the quantity and unit.
        </span>

        <ComboBox
            pattern='^([a-zA-Z0-9]{1,})$'
            avoid={['id', 'id_recipe_ingredient', 'id_recipe', 'id_ingredient', 'unit', 'created_at', 'updated_at']}
            rename={{'id_unit': 'unit'}}
            selectable
            footer

            avoidSearch={['quantity', 'id_unit']}
            
            data={recipeIngredientData}
            initialCustomData={recipeIngredientCustomData}

            customComponents={{
                'quantity': {
                    "component": 
                        <Form.Control 
                            as="input" 
                            type="number" 
                            min={0}
                            inputMode=""
                        />
                    , "defaultValue": 100
                }
                , 'id_unit': {
                    "component": 
                        <Select 
                            data={unitData}
                            showField="name"
                            targetField="id"
                            value={recipeIngredientCustomData['id_unit']}
                        />
                    , "defaultValue": 1
                }
            }}
            
            onClickRow={onClickIngredientRow}
            onChangeCustomData={onChangeRecipeIngredientCustomData}
            selectedRowsTrigger={recipeIngredientSelectedRows}
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