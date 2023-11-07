/* Foreign dependencies */
import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

/* Local dependencies */
import GenericForm from "./components/GenericForm";
import RecipeForm from "./components/RecipeForm";
import Select from "./components/Select";
import { useData } from "./core/dataContext";
import { ComboBox } from "./components/ComboBox/ComboBox";
import { FormContainer, FormContainerContext } from "./components/FormContainer/FormContainer";


export default function App() {
    const dataContext = useData();
    
    const elements = {
        'registry':
            <div>
                <GenericForm
                    id='ingredients-form'
                    title='ingredients' 
                    tableName='ingredient' 
                    inputFields={['name', 'description', 'type']}
                    customInputs={{
                        'type': 
                        <Select tableName='category' filters={{'and': {'type': ["'ingredient'"]}}}/>
                    }}
                    imgSrc="./src/assets/ingredients.avif"
                />
                <div className="text-divider-02"/>
                <GenericForm
                    id='categories-form'
                    title='categories'
                    tableName='category'
                    inputFields={['name', 'type']}
                    customInputs={{'type':
                        <Select customOptions={['ingredient', 'period', 'recipe']}/>
                    }}
                    imgSrc="./src/assets/categories.jpg"
                />
                <div className="text-divider-02"/>
                <GenericForm
                    id='units-form'
                    title='units'
                    tableName='unit'
                    inputFields={['name', 'abbreviation', 'base']}
                    imgSrc="./src/assets/units.jpg"
                />
    
    
            </div>,
        'recipes':
            <RecipeForm
                id='recipes-form'
                title='recipes'
                tableName='recipe'
                inputFields={['name', 'description', 'period', 'type']}
                avoidColumns={['id', 'created_at', 'updated_at']}
                customInputs={{
                    'period': 
                        <Select tableName='category' filters={{'and': {'type': ["'period'"]}}} triggerChange={dataContext.getState('recipe')} />
                    , 'type':
                        <Select tableName='category' filters={{'and': {'type': ["'recipe'"]}}}/>
                }}
                imgSrc="./src/assets/recipes.avif"
                editMode={true}
            />
    }

    const [content, setContent] = useState(elements['registry'])
    const [isContentMounted, setIsContentMounted] = useState(true)

    const handleContentChange = (newContent) => {
        if(newContent === content) return;
        setIsContentMounted(false)
        setTimeout(() => {
            setContent(newContent)
            setIsContentMounted(true)
        }, 500)
    }

    const [dataA, setDataA] = useState([
        {id: 1, name: 'Ingredient A', description: 'This is description A.', type: 'fruit', quantity: 0}
        , {id: 2, name: 'Ingredient B', description: 'This is description B.', type: 'vegetable', quantity: 2}
        , {id: 3, name: 'Ingredient C', description: 'This is description C.', type: 'meat', quantity: 3}
    ])

    const [dataB, setDataB] = useState([
        {id: 1, name: 'Ingredient D', description: 'This is description D.', type: 'fruit', quantity: 5}
        , {id: 2, name: 'Ingredient E', description: 'This is description E.', type: 'vegetable', quantity: 4}
        , {id: 3, name: 'Ingredient F', description: 'This is description F.', type: 'meat', quantity: 3}
    ])

    return (<>
    <Container 
        fluid
        className="main-container"
    >
        <Row >
            {/* Sidebar */}
            <Col  
                xs={3}
                className="sidebar-container"
            >
                
                <div>
                    <div className="sidebar-title-container">
                        <h2 className="sidebar-title">
                            The Cookbook
                        </h2>
                    </div>

                    <div className="sidebar-menu-container">
                        <div className="text-divider-01"/>
                        <p className="sidebar-link" id="recipes-link" onClick={() => handleContentChange(elements['recipes'])}>Recipes</p>
                        <p className="sidebar-link" id="ingredients-link" onClick={() => handleContentChange(elements['registry'])}>Registry</p>
                        <div className="text-divider-01"/>
                    </div>
                </div>
            </Col>

            {/* Content */}
            <Col  
                xs={9}
                className={`content-container ${isContentMounted ? 'entering' : 'exiting'}`}
            >
                {content}
                {/* <FormContainer>
                    <ComboBox
                        // data={dataA}
                        pattern='^([a-zA-Z0-9]{1,})$'
                        avoid={['id', 'id_recipe_ingredient', 'id_ingredient', 'id_unit', 'created_at', 'updated_at']}
                        selectable
                        editable
                        footer
                        quantities
                        parentContext={FormContainerContext}
                    />
                </FormContainer>
                
                <FormContainer>
                    <ComboBox
                        data={dataB}
                        pattern='^([a-zA-Z0-9]{1,})$'
                        avoid={['id']}
                        selectable
                        editable
                        footer
                        quantities
                        // parentContext={FormContainerContext}
                    />
                </FormContainer> */}
            </Col>
        </Row>
    </Container>
    </>)
}