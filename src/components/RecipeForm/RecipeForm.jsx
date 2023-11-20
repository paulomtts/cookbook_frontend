/* Foreign dependencies */
import React, { useEffect, useState } from "react";
import { Button, Form, Image } from "react-bootstrap";

/* Local dependencies */
import { useNotification } from "../../core/notificationContext";
import { useForm } from "../../core/formContext";
import { useData } from "../../core/dataContext";
import { useDataFetcher } from "../../hooks/useDataFetcher";
import { useTrigger } from "../../hooks/useTrigger";
import ComboBox from "../ComboBox/ComboBox";
import Select from "../Select";
import FormFields from "../FormFields/FormFields";

import "./RecipeForm.css";



export default function RecipeForm({imgSrc}) {

    /* Contexts */
    const formContext = useForm();
    const dataContext = useData();
    const notificationContext = useNotification();

    /* Outgoing Data */
    const [formData, setFormData] = useState({
        name: ""
        , type: ""
        , period: ""
        , presentation: ""
        , description: ""
    }); // initial state
  
    /* Incoming Data */
    const [recipeData, setRecipeData] = useDataFetcher("recipes");
    
    const [recipeIngredientData, setRecipeIngredientData] = useDataFetcher("recipe_composition_empty"); // initial state
    const [snapshotRecipeIngredientData, setSnapshotRecipeIngredientData] = useState([]); // snapshot of recipe_ingredient

    /* CustomData & Selected Rows */
    const [recipeIngredientCustomData, setRecipeIngredientCustomData] = useState({});
    const [recipeIngredientSelectedRows, setRecipeIngredientSelectedRows] = useState([]);


    /* Triggers */
    const [triggerRecipeLock, setTriggerRecipeLock] = useTrigger();
    const [triggerRecipeDisplay, setTriggerRecipeDisplay] = useTrigger();
    
    const [triggerIngredientLock, setTriggerIngredientLock] = useTrigger();
    const [triggerIngredientDisplay, setTriggerIngredientDisplay] = useTrigger();
    const [triggerIngredientSelectedRows, setTriggerIngredientSelectedRows] = useTrigger();

    /* Hooks */
    // useEffect(() => {
    //     console.log(recipeData);
    // }, [recipeData]);
        

    /* Events */
    const onClickRecipeRow = async (_, row) => { // reason: ComboBox's onClickRow sends (selectedRows, row)
        const newFormData = {...formData, ...row};
        delete newFormData['updated_at'];
        setFormData(newFormData);


        const { json: snapshotData } = await dataContext.fetchData("recipe_composition_snapshot", {}, {"id_recipe": row[`id`]});
        setSnapshotRecipeIngredientData(snapshotData);
        
        const { json: loadedData } = await dataContext.fetchData("recipe_composition_loaded", {}, {"id_recipe": row[`id`]});       
        setRecipeIngredientData(loadedData);
        
        setRecipeIngredientSelectedRows(snapshotData);

        // Cleanup
        setRecipeIngredientCustomData({});

        // Triggers
        setTriggerRecipeLock(true);
        setTriggerRecipeDisplay("selected");
        
        setTriggerIngredientLock(true);
        setTriggerIngredientDisplay("selected");
        setTriggerIngredientSelectedRows(snapshotData);
    }

    const onClickIngredientRow = async (selectedRows, _) => { // reason: ComboBox's onClickRow sends (selectedRows, row)
        setRecipeIngredientSelectedRows(selectedRows);
    }

    const onChangeRecipeIngredientCustomData = (newCustomData, _) => { // reason: ComboBox's onChangeCustomData sends (quantitiesData, row)
        setRecipeIngredientCustomData(newCustomData);
    }


    /* Handlers */
    const handleSelectChange = (e, key) => {
        const newFormData = {...formData};
        newFormData[key] = e.target.value;
        setFormData(newFormData);
    }

    const handleSaveClick = async (e) => {
        e.preventDefault();
        let consolidatedData = [];

        if ('quantity' in recipeIngredientCustomData) {
            consolidatedData = formContext.consolidateData(recipeIngredientSelectedRows, recipeIngredientCustomData['quantity'], 'id', 'quantity');
            
        }
        if ('id_unit' in recipeIngredientCustomData) {
            consolidatedData = formContext.consolidateData(consolidatedData, recipeIngredientCustomData['id_unit'], 'id', 'id_unit');
        }

        if (consolidatedData.length > 0) {
            const consolidatedOperations = formContext.consolidateOperations(snapshotRecipeIngredientData, consolidatedData, 'id');
            const { insertRows, updateRows, deleteRows } = consolidatedOperations;
           
            const consolidatedInsertRows = formContext.removeColumns(insertRows, ['id', 'id_recipe_ingredient', 'description', 'name', 'unit', 'type']);
            const consolidatedUpdateRows = formContext.removeColumns(updateRows, ['description', 'name', 'unit', 'type']);
            
            // Send changes to API
            if (consolidatedInsertRows.length > 0) {
                await dataContext.submitData("recipe_ingredients", consolidatedInsertRows, true);
            }

            consolidatedUpdateRows.forEach(async (row) => {
                row['id'] = row['id_recipe_ingredient'];
                delete row['id_recipe_ingredient'];

                await dataContext.updateData("recipe_ingredients", row['id'], row);
            });

            deleteRows.forEach(async (row) => {
                await dataContext.deleteData("recipe_ingredients", {"id_ingredient": [row['id']]});
            });
            
            if (Object.keys(formData).includes('id')) {
                await dataContext.updateData("recipes", formData['id'], formData);
            } else {
                await dataContext.submitData("recipes", formData);
            }


            console.log(consolidatedInsertRows);
            console.log(consolidatedUpdateRows);
            console.log(deleteRows);

            console.log(formData);
        } 
        else {
            notificationContext.spawnToast({
                title: "No changes"
                , message: "No data was submitted."
                , variant: "info"
            });
            return;
        }


        // need to retrieve data afterwards
    }

    return(<>
        <Form className="GenericForm">
            <Image className={`GenericForm-image`} src={imgSrc} />

            <div className="RecipeForm-container">
                <span className={`GenericForm-description`}>
                    This form allows you to edit the ingredients and quantities of a recipe.
                </span>
                
                <h2 className={`GenericForm-title`}>
                    Recipes
                </h2>

                <div style={{display: 'flex'}}>
                    <ComboBox
                        className={`RecipeForm-recipe`}
                        pattern='^([a-zA-Z0-9]{1,})$'
                        avoid={['id', 'id_recipe_ingredient', 'id_recipe', 'id_ingredient', 'id_unit', 'created_at', 'updated_at']}
                        selectable
                        single
                        footer
                        
                        data={recipeData}
                        
                        onClickRow={onClickRecipeRow}
                        
                        lockTrigger={triggerRecipeLock}
                        displayTrigger={triggerRecipeDisplay}
                    />
                    <div className="ImageUploader">
                        <span>Image goes here</span>
                    </div>
                </div>

                <FormFields
                    tableName="recipes"
                    fields={Object.keys(formData)}
                    avoid={['id', 'created_at', 'updated_at']}
                    formData={formData}
                    customInputs={{ 
                        'description': <Form.Control as="textarea" rows={3} />
                        , 'type': 
                            <Select 
                                tableName="categories"
                                filters={{'and': {'type':  ["'recipe'"]}}}
                                targetField='name'
                                value={formData['type']}
                            />
                        , 'period':
                            <Select 
                                tableName="categories" 
                                filters={{'and': {'type':  ["'period'"]}}}
                                targetField='name'
                                value={formData['period']}
                            />
                        , 'presentation':
                            <Select 
                                tableName="categories" 
                                filters={{'and': {'type':  ["'presentation'"]}}}
                                targetField='name'
                                value={formData['presentation']}
                            />
                    }}
                    onInputChange={(e, key) => handleSelectChange(e, key)}
                />

                <ComboBox
                    pattern='^([a-zA-Z0-9]{1,})$'
                    avoid={['id', 'id_recipe_ingredient', 'id_recipe', 'id_ingredient', 'unit', 'created_at', 'updated_at']}
                    rename={{'id_unit': 'unit'}}
                    selectable
                    footer
                    
                    data={recipeIngredientData}
                    customComponents={{
                        'quantity': {
                            "component": 
                                <Form.Control as="input" type="number" min={0} />
                            , "defaultValue": 100
                        }
                        , 'id_unit': {
                            "component": <Select tableName="units" />
                            , "defaultValue": 2
                        }
                    }}
                    
                    onClickRow={onClickIngredientRow}
                    onChangeCustomData={onChangeRecipeIngredientCustomData}
                    
                    lockTrigger={triggerIngredientLock}
                    displayTrigger={triggerIngredientDisplay}
                    selectedRowsTrigger={triggerIngredientSelectedRows}
                />
            </div>
            <Button 
                variant="primary"
                type="submit"
                onClick={handleSaveClick}
                >
                Consolidate
            </Button>
        </Form>
    </>);
}