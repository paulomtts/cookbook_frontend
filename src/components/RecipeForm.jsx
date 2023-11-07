/* Foreign dependencies */
import React, { useEffect, useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";

/* Local dependencies */
import FormHeader from "./FormHeader";
import FormFields from "./FormFields";
import ComboBox from "./ComboBox";
import Select from "./Select";
import { useData } from "../core/dataContext";
import { useNotification } from "../core/notificationContext";


export default function GenericForm({
    id
    , title
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

    const [mode, setMode] = useState('create');

    const [recipesData, setRecipesData] = useState([]);
    const [ingredientsData, setIngredientsData] = useState([]);
    const [recipeIngredientsData, setRecipeIngredientsData] = useState([]);


    const [snapshotFormData, setSnapshotFormData] = useState({});
    const [snapshotFormIngredients, setSnapshotFormIngredients] = useState([]);

    const [formData, setFormData] = useState({});
    const [formIngredients, setFormIngredients] = useState([]);


    useEffect(() => {  
        retrieveRecipesData();
        retrieveIngredientsData();
    }, []);

    useEffect(() => {
        const newFormIngredients = recipeIngredientsData.map((row) => {
            return {id: row.id_ingredient, quantity: row.quantity}
        })

        setFormIngredients(newFormIngredients);
        setSnapshotFormIngredients(newFormIngredients);
    }, [recipeIngredientsData])


    /* Data retrieval */   
    const retrieveRecipesData = async () => {
        const { response, json } = await dataContext.fetchData(tableName, {}, false, true);

        if(response.status === 200) {
            const newData = JSON.parse(json.data);
            setRecipesData(newData);

            const newFormData = {};
            Object.keys(newData[0]).map((key) => {
                if(avoidColumns.includes(key)) return;

                if(Object.keys(customInputs).includes(key)) {
                    return newFormData[key] = formData[key] || '';
                }

                return newFormData[key] = '';
            })

            setFormData(newFormData);
        } 
        else {
            const newFormData = {};
            inputFields.map((key) => {
                return newFormData[key] = '';
            })

            setFormData(newFormData);
        }
    }

    const retrieveIngredientsData = async (manualTrigger = false) => {
        if (dataContext.getState('ingredient').length > 0 && manualTrigger === false) {
            const newData = dataContext.getState('ingredient');
            setIngredientsData(newData);
            return;
        }

        const { response, json } = await dataContext.fetchData('ingredient', {}, false, true);
        let newData = [];

        if(response.status === 200) {
            newData = JSON.parse(json.data);
        }

        setIngredientsData(newData);
    }

    const retrieveRecipeIngredientsData = async (id) => {
        const { response, json } = await dataContext.fetchData('recipe_ingredient', {and: {id_recipe: [id]}}, false, true);
        let newData = [];

        if(response.status === 200) {
            newData = JSON.parse(json.data);

            notificationContext.spawnToast({
                title: 'Success'
                , message: `Ingredients loaded!`
                , variant: 'success'
            })
        } else {
            notificationContext.spawnToast({
                title: 'Warning'
                , message: `No ingredients found for this recipe.`
                , variant: 'warning'
            })
        }

        setRecipeIngredientsData(newData);
    }


    /* Data submission comparison */
    function objectsEqual(objA, objB) {
        return JSON.stringify(objA) === JSON.stringify(objB);
    }

    function compareData(snapshotData, newData, uniqueField) {
        console.log('snapshotData', snapshotData)
        console.log('newData', newData)
        const updates = [];
        const inserts = [];
        const deletes = [];

        const snapshotDataMap = new Map(snapshotData.map(item => [item[uniqueField], item]));

        newData.forEach(newItem => {
            const id = newItem[uniqueField];
            const snapshotItem = snapshotDataMap.get(id);

            if (snapshotItem) {
                if(!objectsEqual(newItem, snapshotItem)) {
                    updates.push(newItem);
                }
            } else {
                inserts.push(newItem);
            }
        });

        snapshotData.forEach(snapshotItem => {
            const id = snapshotItem[uniqueField];

            if (!newData.some(newItem => newItem[uniqueField] === id)) {
                deletes.push(snapshotItem);
            }
        });

        return {updates, inserts, deletes};
    }


    /* Handlers */
    const handleFormInputChange = (e, key) => {
        setFormData({...formData, [key]: e.target.value});
    }

    const handleRecipeOptionClick = (rows) => {
        const row = rows[0];
        const newFormData = {...formData};
        Object.keys(row).map((key) => {
            if(avoidColumns.includes(key)) return;
            newFormData[key] = row[key];

        })

        setMode('edit');
        setFormData(newFormData);
        setSnapshotFormData(newFormData);
        retrieveRecipeIngredientsData(row.id);
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if(Object.values(formData).includes('')) {
            notificationContext.spawnToast({
                title: 'Incomplete form'
                , message: 'Please fill all the fields.'
                , variant: 'warning'
            })
            return;
        }

        if(formIngredients.length === 0) {
            notificationContext.spawnToast({
                title: 'Ingredients missing'
                , message: 'Please add at least one ingredient.'
                , variant: 'warning'
            })
            return;
        }
        
        if(mode === 'create') {
            await dataContext.submitData(tableName, formData);

            // need to retrieve the id that was just inserted

            const formIngredientsToSubmit = formIngredients.map((row) => {
                return {
                    id_recipe: formData.id
                    , id_ingredient: row.id
                    , quantity: row.quantity
                    , id_unit: 1
                }
            })

            await dataContext.submitData('recipe_ingredient', {json_data: formIngredientsToSubmit}, true);
        } else {
            if(!objectsEqual(formData, snapshotFormData)) {
                await dataContext.updateData(tableName, formData.id, formData);
            }

            const {updates, inserts, deletes} = compareData(snapshotFormIngredients, formIngredients, 'id');
            console.log('updates', updates);
            console.log('inserts', inserts);
            console.log('deletes', deletes);
            
            if(updates.length > 0) {
                updates.forEach(async (row) => {
                    await dataContext.updateData('recipe_ingredient', row.id, row);
                })                
            }

            if(inserts.length > 0) {
                await dataContext.submitData('recipe_ingredient', inserts, true);
            }

            if(deletes.length > 0) {
                await dataContext.deleteData('recipe_ingredient', {or: {id: deletes.map((row) => row.id)}});
            }
        }

        retrieveRecipesData();
        
        setMode('create');

        const newFormData = {};
        inputFields.map((key) => {
            return newFormData[key] = '';
        })

        setFormData(newFormData);
        setSnapshotFormData({});
        
        setFormIngredients([]);
        setSnapshotFormIngredients([]);
        
        setRecipeIngredientsData([]);

        const firstInput = document.getElementById(`${tableName}-generic-form-input-${inputFields[0]}`);
        firstInput.focus();
    }

    
    return (<>
    <Form className='generic-form'>
        <FormHeader 
            id={id} 
            imgSrc={imgSrc} 
            title={title} 
            text="Click a recipe on the list below to load it into the form" 
        />

        {recipesData.length > 0 &&
        <ComboBox
            name='box1'
            data={recipesData}

            avoidColumns={avoidColumns}
            pattern={searchPattern}

            editMode={editMode}
            singleMode={true}
            
            onOptionClick={handleRecipeOptionClick}
        />}
        <hr/>
        <FormFields
            tableName={tableName}
            formData={formData}
            inputFields={inputFields}
            customInputs={customInputs}
            avoidColumns={avoidColumns}
            onInputChange={handleFormInputChange}
        />

        <Row style={{margin: '0px', paddingBottom: '10px'}}>
            <Col>
                <Button
                    type="submit"
                    className="generic-form-submit"
                    onClick={handleFormSubmit}
                    onKeyDown={(e) => {
                        if(e.key === 'Tab') {
                            e.preventDefault();
                            const firstInput = document.getElementById(`${tableName}-generic-form-input-${inputFields[0]}`);
                            firstInput.focus();
                        }
                    }}
                    >
                    Submit
                </Button>
            </Col>
        </Row>

        {ingredientsData.length > 0 && <div>
            <hr/>
            <p className={`recipe-form-text`}>
                Ingredient list
            </p>
            <ComboBox 
                name='box2'
                data={ingredientsData}
                quantityData={recipeIngredientsData}
                avoidColumns={avoidColumns}
                pattern={searchPattern}
                editMode={editMode}
                showQuantities={true}
                
                onOptionClick={(e) => {
                    console.log(e);
                    setFormIngredients(e)}}
                onQuantityChange={(e) => {console.log(e)}}
                onDelete={(e) => {console.log(e)}}
            />
        </div>}

    </Form>
    </>)
}