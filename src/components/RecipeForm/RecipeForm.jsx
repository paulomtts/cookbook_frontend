/* Foreign dependencies */
import React, { useState } from "react";
import { Form, Image } from "react-bootstrap";
import { faSave, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* Local dependencies */
import { useNotification } from "../../core/notificationContext";
import { useData, api } from "../../core/dataContext";
import { useDataFetcher } from "../../hooks/useDataFetcher";
import { useTrigger } from "../../hooks/useTrigger";
import { useForm } from "../../core/formContext";
import ComboBox from "../ComboBox/ComboBox";
import Select from "../Select";
import FormFields from "../FormFields/FormFields";
import TooltipOverlay from "../TooltipOverlay/TooltipOverlay";
import ConfirmationPopover from "../ConfirmationPopover/ConfirmationPopover";
import FormButton from "../FormButton/FormButton";

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
    const [recipeSelectedRow, setRecipeSelectedRow] = useState([]);

    const [recipeIngredientCustomData, setRecipeIngredientCustomData] = useState({});
    const [recipeIngredientSelectedRows, setRecipeIngredientSelectedRows] = useState([]);

    /* Triggers */
    const [triggerRecipeLock, setTriggerRecipeLock] = useTrigger();
    const [triggerRecipeDisplay, setTriggerRecipeDisplay] = useTrigger();
    const [triggerRecipeSelectedRow, setTriggerRecipeSelectedRow] = useTrigger();
    
    const [triggerIngredientLock, setTriggerIngredientLock] = useTrigger();
    const [triggerIngredientDisplay, setTriggerIngredientDisplay] = useTrigger();
    const [triggerIngredientSelectedRows, setTriggerIngredientSelectedRows] = useTrigger();


    /* Events */
    const onClickRecipeRow = async (selectedRow, row) => { // reason: ComboBox's onClickRow sends (selectedRows, row)
        
        setRecipeSelectedRow(selectedRow);
        
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
            
            const url = api.custom.insert;
            const payload = dataContext.generatePayload({method: 'POST', body: JSON.stringify({
                form_data: formData
                , insert_rows: consolidatedInsertRows
                , update_rows: consolidatedUpdateRows
                , delete_rows: deleteRows
            })});
            
            await dataContext.customRoute(url, payload, true);
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
            <h2 className={`GenericForm-title`}>
                Recipes
            </h2>

            <div className="RecipeForm-container">
                
                <span className={`GenericForm-description`}>
                    You can use this form to create new recipes or update existing ones. Follow the tooltips!
                </span>

                <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem'}}>
                        

                    <ConfirmationPopover 
                        text="Unsaved changes will be lost." 
                        placement={'bottom'}
                        onYes={() => {window.location.reload();}}
                    >
                        <TooltipOverlay
                            content={"Clear the form and start a new recipe."}
                            placement={'left'}
                        >
                            <FormButton onClick={(e) => {e.preventDefault()}}>
                                <FontAwesomeIcon icon={faPlus} />
                            </FormButton>
                        </TooltipOverlay>
                    </ConfirmationPopover>

                    <ConfirmationPopover
                        text="This will save changes to the current recipe."
                        placement={'bottom'}
                        onYes={handleSaveClick}
                    >
                        <TooltipOverlay
                            content={"Submit a recipe or update an existing one."}
                            placement={'top'}
                        >
                            <FormButton onClick={(e) => {e.preventDefault()}}>
                                <FontAwesomeIcon icon={faSave} />
                            </FormButton>
                        </TooltipOverlay>
                    </ConfirmationPopover>

                    <ConfirmationPopover
                        text="This will delete the current recipe."
                        placement={'bottom'}
                        onYes={() => {}}
                    >
                        <TooltipOverlay
                            content={"Submit a recipe or update an existing one."}
                            placement={'bottom'}
                        >
                            <FormButton onClick={(e) => {e.preventDefault()}}>
                                <FontAwesomeIcon icon={faTrash} />
                            </FormButton>
                        </TooltipOverlay>
                    </ConfirmationPopover>


                </div>
                
                <TooltipOverlay 
                    content={'Click a recipe from the list to load its contents onto the form!'} 
                    placement={'bottom'}
                >
                    <div style={{display: 'flex'}}>
                            <ComboBox
                                tableContainerClassName={`RecipeForm-recipe-table`}
                                pattern='^([a-zA-Z0-9]{1,})$'
                                avoid={['id', 'id_recipe_ingredient', 'id_recipe', 'id_ingredient', 'id_unit', 'created_at', 'updated_at']}
                                selectable
                                single
                                footer
                                
                                data={recipeData}
                                
                                onClickRow={onClickRecipeRow}
                                
                                lockTrigger={triggerRecipeLock}
                                displayTrigger={triggerRecipeDisplay}
                                selectedRowsTrigger={triggerRecipeSelectedRow}
                                />
                        <div className="ImageUploader">
                            <span>Placeholder for image</span>
                        </div>
                    </div>
                </TooltipOverlay>

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

                <TooltipOverlay
                    content={"Click an ingredient to add or remove it from the recipe."}
                    placement={'top'}
                >
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
                </TooltipOverlay>
            </div>
        </Form>
    </>);
}