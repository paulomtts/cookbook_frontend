/* Foreign dependencies */
import React, { useEffect, useState } from "react";
import { Form, Image } from "react-bootstrap";
import { faSave, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* Local dependencies */
import { useNotification } from "../../core/notificationContext";
import { useData, api } from "../../core/dataContext";
import { useConfigs } from "../../core/configsContext";
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

const formModel = {
    id: ""
    , name: ""
    , type: ""
    , period: ""
    , presentation: ""
    , description: ""
    , created_at: ""
    , updated_at: ""
}


export default function RecipeForm({imgSrc}) {

    /* Contexts & Methods */
    const dataContext = useData();
    const { maps } = useConfigs();
    const { consolidateData } = useForm();
    const { spawnToast } = useNotification();

    /* Data */
    const [recipeData, setRecipeData] = useDataFetcher("recipes");

    const [recipeIngredientData, setRecipeIngredientData] = useDataFetcher("recipe_composition_empty");
    const unitData = dataContext.getState('units');
    
    const [formData, setFormData] = useState({...formModel});
    const [ selectCategoriesData ] = useDataFetcher("categories", {"and_": {"type": ["recipe"]}});
    const [ selectPeriodsData ] = useDataFetcher("categories", {"and_": {"type": ["timing"]}});
    const [ selectPresentationsData ] = useDataFetcher("categories", {"and_": {"type": ["course"]}});

    /* CustomData & Selected Rows */
    const [recipeIngredientCustomData, setRecipeIngredientCustomData] = useState({}); // reason: for ComboBox use
    const [recipeIngredientSelectedRows, setRecipeIngredientSelectedRows] = useState([]); // reason: for ComboBox use

    /* Others */
    const [fields, setFields] = useState([]);

    /* Triggers */
    const [triggerRecipeLock, setTriggerRecipeLock] = useTrigger();
    const [triggerRecipeDisplay, setTriggerRecipeDisplay] = useTrigger();
    const [triggerRecipeSelectedRows, setTriggerRecipeSelectedRows] = useTrigger();
    
    const [triggerIngredientLock, setTriggerIngredientLock] = useTrigger();
    const [triggerIngredientDisplay, setTriggerIngredientDisplay] = useTrigger();
    const [triggerIngredientSelectedRows, setTriggerIngredientSelectedRows] = useTrigger();


    /* Effects */
    useEffect(() => {
        if (Object.keys(maps).length === 0) return;
        setFields(maps.forms.fields['recipes']);
    }, [maps]);


    /* Events */
    const onClickRecipeRow = async (_, row) => { // reason: ComboBox's onClickRow sends (selectedRows, row)
        const newFormData = {...formData, ...row};
        
        const { json: loadedData } = await dataContext.fetchData("recipe_composition_loaded", {}, {"id_recipe": row[`id`]});       
        const { json: snapshotData } = await dataContext.fetchData("recipe_composition_snapshot", {}, {"id_recipe": row[`id`]});
        
        setFormData(newFormData);
        setRecipeIngredientData(loadedData);

        setRecipeIngredientSelectedRows(snapshotData);

        // Triggers       
        setTriggerIngredientLock(true);
        setTriggerIngredientDisplay("selected");
        setTriggerIngredientSelectedRows(snapshotData);
    }

    const onClickIngredientRow = async (selectedRows, _) => { // reason: ComboBox's onClickRow sends (selectedRows, row)
        setRecipeIngredientSelectedRows(selectedRows);
    }

    const onChangeRecipeIngredientCustomData = (newCustomData) => { // reason: ComboBox's onChangeCustomData sends customData
        setRecipeIngredientCustomData(newCustomData);
    }


    /* Handlers */
    const handleInputChange = (value, key) => {
        const newFormData = {...formData};
        newFormData[key] = value;
        setFormData(newFormData);
    }

    const handleSaveClick = async () => {
        
        if (recipeIngredientSelectedRows.length === 0) {
            spawnToast({
                title: "Warning"
                , message: "You must select at least one ingredient."
                , variant: "warning"
            });
            return;
        }
        
        let consolidatedData = [];

        if ('quantity' in recipeIngredientCustomData) {
            consolidatedData = consolidateData(recipeIngredientSelectedRows, recipeIngredientCustomData['quantity'], 'id', 'quantity');
        }
        
        if ('id_unit' in recipeIngredientCustomData) {
            consolidatedData = consolidateData(consolidatedData, recipeIngredientCustomData['id_unit'], 'id', 'id_unit');
        }

        const now = new Date(); // for tests only, get datetime from server
        const url = api.custom.recipes.upsert;
        const payload = dataContext.generatePayload({method: 'POST', body: JSON.stringify({
            form_data: formData
            , reference_time: now.toISOString()
            , recipe_ingredients_rows: consolidatedData
        })});
        
        const { response, content } = await dataContext.customRoute(url, payload, true);
        
        if (!response.status_code == 200) return;

        const newFormData = JSON.parse(content.data.form_data);
        const newRecipeData = JSON.parse(content.data.recipes_data);
        const newRecipeIngredientData = JSON.parse(content.data.recipe_ingredients_loaded);
        const newRecipeIngredientsSelectedRows = JSON.parse(content.data.recipe_ingredients_snapshot);

        // Display new data
        setFormData(newFormData);
        setRecipeData(newRecipeData);
        setRecipeIngredientData(newRecipeIngredientData);
        setRecipeIngredientSelectedRows(newRecipeIngredientsSelectedRows);

        // Triggers
        setTriggerRecipeLock(true);
        setTriggerRecipeDisplay("selected");

        const newRecipeRow = newRecipeData.find((row) => row['id'] === newFormData['id']);
        setTriggerRecipeSelectedRows([newRecipeRow]);

        
        setTriggerIngredientLock(true);
        setTriggerIngredientDisplay("selected");
        setTriggerIngredientSelectedRows(newRecipeIngredientsSelectedRows);

        
    }

    const handleDeleteClick = async () => {
        const url = api.custom.recipes.delete;
        const payload = dataContext.generatePayload({method: 'DELETE', body: JSON.stringify({
            recipe: {
                field: 'id'
                , values: [formData['id']]
            }
            , composition: {
                field: 'id_recipe'
                , values: [formData['id']]
            }
        })});
        
        const { response, content } = await dataContext.customRoute(url, payload, true);

        if (!response.status_code == 200) return;
        
        const newRecipeData = JSON.parse(content.data.recipes_data);
        const newRecipeIngredientData = JSON.parse(content.data.recipe_ingredients_data);

        // Cleanup
        setFormData({...formModel});
        setRecipeData(newRecipeData);
        setRecipeIngredientData(newRecipeIngredientData);
        setRecipeIngredientSelectedRows([]);

        // Triggers
        setTriggerRecipeLock(false);
        setTriggerRecipeDisplay("all");
        setTriggerRecipeSelectedRows([]);

        setTriggerIngredientLock(false);
        setTriggerIngredientDisplay("all");
        setTriggerIngredientSelectedRows([]);
    }


    /* Methods */
    const checkDisableConditions = (type) => {
        let disabled = false;
        switch (type) {
            case 'save':
                if (recipeIngredientSelectedRows.length === 0) {
                    disabled = true;
                }
                fields.forEach((field) => {
                    if (formData[field] === "") {
                        disabled = true;
                    }
                });

                break;
            case 'delete':
                formData['id'] ? disabled = false : disabled = true;
                break;
            default:
                return false;
        }
        return disabled;
    }


    return(<>
        <Form className="GenericForm">

            <Image className={`GenericForm-image`} src={imgSrc} />
            {/* <h2 className={`GenericForm-title`}>
                Recipes
            </h2> */}

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
                        disabled={checkDisableConditions('save')}
                    >
                        <TooltipOverlay
                            content={"Submit a recipe or update an existing one."}
                            placement={'left'}
                        >
                            <FormButton onClick={(e) => {e.preventDefault()}} disabled={checkDisableConditions('save')}>
                                <FontAwesomeIcon icon={faSave} />
                            </FormButton>
                        </TooltipOverlay>
                    </ConfirmationPopover>

                    <ConfirmationPopover
                        text="This will delete the current recipe."
                        placement={'bottom'}
                        onYes={handleDeleteClick}
                        disabled={checkDisableConditions('delete')}
                    >
                        <TooltipOverlay
                            content={"Delete the currently selected recipe."}
                            placement={'left'}
                        >
                            <FormButton onClick={(e) => {e.preventDefault()}} disabled={checkDisableConditions('delete')}>
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
                            avoid={['id', 'id_recipe_ingredient', 'id_recipe', 'id_ingredient', 'id_unit', 'created_at', 'updated_at', 'created_by', 'updated_by']}
                            selectable
                            single
                            footer
                            
                            data={recipeData}
                            
                            onClickRow={onClickRecipeRow}
                            
                            lockTrigger={triggerRecipeLock}
                            displayTrigger={triggerRecipeDisplay}
                            selectedRowsTrigger={triggerRecipeSelectedRows}
                        />

                    <div className="ImageUploader">
                        <span>Placeholder for image</span>
                    </div>
                </div>
                </TooltipOverlay>

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

                        avoidSearch={['quantity', 'id_unit']}
                        
                        data={recipeIngredientData}
                        customComponents={{
                            'quantity': {
                                "component": 
                                    <Form.Control as="input" type="number" min={0}/>
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
                        
                        lockTrigger={triggerIngredientLock}
                        displayTrigger={triggerIngredientDisplay}
                        selectedRowsTrigger={triggerIngredientSelectedRows}
                    />
                </TooltipOverlay>
            </div>
        </Form>
    </>);
}