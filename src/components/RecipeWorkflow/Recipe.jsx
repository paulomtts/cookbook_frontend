/* Foreign dependencies */
import React, { createContext, useEffect, useState } from "react";
import { Image, Form } from "react-bootstrap";


/* Local dependencies */
import { useNotification } from "../../core/notificationContext";
import { useData, api } from "../../core/dataContext";
import { useConfigs } from "../../core/configsContext";
import { useDataFetcher } from "../../hooks/useDataFetcher";
import { useForm } from "../../core/formContext";

import RecipeForm from "./RecipeForm";
import RecipeCombobox from "./RecipeCombobox";
import RecipeReview from "./RecipeReview";

import './Recipe.css';



const RecipeContext = createContext();
const { Provider } = RecipeContext;


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

export default function Recipe ({
    imgSrc
    , onSubmit = () => {}
}) {

    /* Contexts & Methods */
    const dataContext = useData();
    const { maps } = useConfigs();
    const { consolidateData } = useForm();
    const { spawnToast } = useNotification();


    /* Data */
    const [formData, setFormData] = useState({...formModel});
    const [recipeIngredientData, setRecipeIngredientData] = useDataFetcher("recipe_composition_empty");

    const unitData = dataContext.getState('units');
    const [ selectCategoriesData ] = useDataFetcher("categories", {"and_": {"type": ["recipe"]}});
    const [ selectPeriodsData ] = useDataFetcher("categories", {"and_": {"type": ["timing"]}});
    const [ selectPresentationsData ] = useDataFetcher("categories", {"and_": {"type": ["course"]}});

    /* Custom data & Selected rows */
    const [recipeIngredientCustomData, setRecipeIngredientCustomData] = useState({}); // reason: for ComboBox use
    const [recipeIngredientSelectedRows, setRecipeIngredientSelectedRows] = useState([]); // reason: for ComboBox use


    /* Others */
    const [fields, setFields] = useState([]);


    /* Effects */
    useEffect(() => {
        if (Object.keys(maps).length === 0) return;
        setFields(maps.forms.fields['recipes']);
    }, [maps]);


    /* Handlers */
    const handleSubmitClick = async () => {
        
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
        
        const { response } = await dataContext.customRoute(url, payload, true);
        if (response.ok) {
            // spawnToast({
            //     title: "Success"
            //     , message: "Recipe created successfully."
            //     , variant: "success"
            // });
            onSubmit('home');
        }
    }


    const [currStep, setCurrStep] = useState(1);

    /* Context */
    const values = {
        fields
        , formData
        , setFormData
        , recipeIngredientData
        , setRecipeIngredientData
        , unitData
        , selectCategoriesData
        , selectPeriodsData
        , selectPresentationsData

        , recipeIngredientCustomData, setRecipeIngredientCustomData
        , recipeIngredientSelectedRows, setRecipeIngredientSelectedRows
    }

    return (<><Provider value={values}>
        <Form className="GenericForm flex vertical gap-2" style={{margin: '0.625rem'}}>
            <Image className={`GenericForm-image`} src={imgSrc} />
            <h2 className={`FormTitle`}>
                Recipes
            </h2>


            <div className="flex vertical gap-3"  style={{padding: '1rem'}}>                 
                {currStep === 1 && <>
                    <RecipeForm
                        fields={fields}
                        formData={formData}
                        onNext={() => setCurrStep(2)}
                    />
                </>}
                {currStep === 2 && <>
                    <RecipeCombobox
                        fields={fields}
                        formData={formData}
                        onPrevious={() => setCurrStep(1)}
                        onNext={() => setCurrStep(3)}
                    />
                </>}

                {currStep === 3 && <>
                    <RecipeReview
                        fields={fields}
                        formData={formData}
                        onPrevious={() => setCurrStep(2)}
                        onSubmit={handleSubmitClick}
                    />
                </>}

            </div>
        </Form>
    </Provider></>);
}

export { RecipeContext };