/* Foreign dependencies */
import React, { useEffect, useState } from "react";
import { Card, Dropdown, Form, Table, InputGroup, Button } from "react-bootstrap";
import { faLockOpen, faLock, faTrash } from "@fortawesome/free-solid-svg-icons"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { v4 } from "uuid";



export default function ComboBox({
    data
    , quantityData = null
    , avoidColumns = ['id', 'created_at', 'updated_at']
    , pattern = '^([a-zA-Z0-9]{1,})$'
    , editMode = false
    , showQuantities = false
    , singleMode = false
    
    , onOptionClick = () => {} // there is a conceptual mistake here, as onOptionClick will pass up all selected options, rather than just the one that was clicked
    , onQuantityChange = () => {}
    , onDelete = () => {}
}) {
    const uuid = v4();
    
    const [quantities, setQuantities] = useState({});
    
    const [search, setSearch] = useState("");
    const [searchMode, setSearchMode] = useState('All');
    
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [displayMode, setDisplayMode] = useState('All');
    
    const [isLocked, setIsLocked] = useState(false);


    useEffect(() => {
        if(data && data.length === 0) return;

        const newQuantities = {};

        data.map((option) => {
            newQuantities[option[`id`]] = 0;
        });

        setQuantities(newQuantities);
    }, [data]);

    useEffect(() => {
        if(!quantityData) return; 
        if(Object.keys(quantities).length === 0) return;

        const newQuantities = {...quantities};
        const newSelectedOptions = [];

        Object.keys(quantities).map((id_ingredient) => {
            const quantDataRow = quantityData.find((row) => row[`id_ingredient`] == id_ingredient.toString());
            newQuantities[id_ingredient.toString()] = quantDataRow ? quantDataRow[`quantity`] : 0;

            if(newQuantities[id_ingredient.toString()]) {
                const selectedOption = {
                    id: parseInt(id_ingredient)
                    , quantity: newQuantities[id_ingredient.toString()]
                }

                newSelectedOptions.push(selectedOption);
            }
        });

        setQuantities(newQuantities);
        setSelectedOptions(newSelectedOptions);

        setIsLocked(true);
        setDisplayMode('Selected');
        setSearch('');
        
    }, [quantityData]);


    const buildModifiedOptions = (alteredOptions, alteredQuantities) => {    
        const modifiedOptions = alteredOptions.map((alteredOption) => {
            const newOption = {
                id: alteredOption[`id`]
                , quantity: alteredQuantities[alteredOption[`id`].toString()]
            }

            return newOption;
        });

        return modifiedOptions;
    }

    
    /* Handlers */
    const handleOptionClick = (option) => {
        if(editMode  === false) return;
        if(isLocked) return;

        const id = option[`id`];
        const newQuantities = {...quantities}

        if(selectedOptions.includes(option)) {
            if(singleMode) return;
            const filteredOptions = selectedOptions.filter((item) => item !== option);
            setSelectedOptions(filteredOptions);

            if(newQuantities[id] > 0) {
                newQuantities[id] = 0;
                setQuantities(newQuantities);
            }
               
            const modifiedOptions = buildModifiedOptions(filteredOptions, newQuantities);
            onOptionClick(modifiedOptions);

        } else {
            let newOptions;
            if(singleMode) {
                handleLockClick();
                newOptions = [option];
            } else {
                newOptions = [...selectedOptions, option];
            }

            setSelectedOptions(newOptions);
            
            if(newQuantities[id] === 0) {
                newQuantities[id] = 1;
                setQuantities(newQuantities);
            }

            if(singleMode) {
                onOptionClick(newOptions);
                return;
            }

            const modifiedOptions = buildModifiedOptions(newOptions, newQuantities);
            onOptionClick(modifiedOptions);
        }
    }

    const handleQuantityChange = (e, option) => {
        if (e.target.value === '') return;

        const id = option['id'];
        const newQuantities = {...quantities};

        newQuantities[id] = parseInt(e.target.value)??0;
        setQuantities(newQuantities);

        const modifiedOptions = buildModifiedOptions(selectedOptions, newQuantities);
        onQuantityChange(modifiedOptions);
    }

    const handleDelete = (e, option) => {
        e.preventDefault();

        const response = onDelete(option);
        const id = option[`id`];
        if(response.status === 200) {
            const newQuantities = {...quantities};
            delete newQuantities[id];
            setQuantities(newQuantities);

            const newSelectedOptions = selectedOptions.filter((item) => item !== option);
            setSelectedOptions(newSelectedOptions);
        }
    }

    const handleLockClick = () => {
        if(editMode) {
            if(isLocked) {
                setDisplayMode('All');
            } else {
                setDisplayMode('Selected');
            }
        }

        setIsLocked(!isLocked);
        setSearch('');
    }

    /* Virtualized table */
    const renderRow = ({ index }) => {
        const option = data[index];

        return (
        <tr key={`${index}`}>
            <td style={{
                cursor: isLocked ? 'default' : 'pointer'
                , textAlign: 'center'
            }}>
                {editMode ?
                    <Form.Check
                        id={`checkbox-${index}`}
                        type="checkbox"
                        checked={selectedOptions.map((selOption) => selOption[`id`]).includes(option[`id`])}
                        onChange={() => handleOptionClick(option, index)}
                    />
                :
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        style={{
                            display: 'inline-block'
                            , fontSize: '12px' 

                        }}
                        disabled={isLocked}
                        onClick={(e) => handleDelete(e, option)}
                    >
                        <FontAwesomeIcon icon={faTrash}/>
                    </Button>
                }
            </td>

            {data.length > 0 && Object.keys(data[0]).map((key, index) => {
                if(['created_at', 'updated_at', 'id'].includes(key)) return null;

                return <td 
                    key={`option-${index}`}
                    style={{ 
                        verticalAlign: 'middle'
                        , cursor: isLocked ? 'default' : 'pointer'
                        , userSelect: 'none'
                        , paddingLeft: '10px'
                    }} 
                    onClick={() => handleOptionClick(option, index)}
                >
                    {option[key]}
                </td>
            })}

            {showQuantities && Object.keys(quantities).length > 0 && <td style={{verticalAlign: 'middle', padding: '0px'}}>
                <Form.Control
                    className="ComboBox-quantity-input"
                    id={`quantity-${index}`}
                    type="number"
                    disabled={isLocked}
                    min={0}
                    value={quantities[option['id']]}
                    onChange={(e) => handleQuantityChange(e, option)}
                    style={{
                        backgroundColor: (isLocked ? 'transparent' : 'white')
                        , textAlign: 'center'
                        , border: 'none'
                        , borderRadius: '0px'
                    }}
                />
            </td>}
        </tr>
        );
    };


    /* Search and display mode conditions */
    const checkSearchCondition = (option) => {
        if(searchMode === 'All') {
            const values = Object.values(option);
            const searchCondition = values.some((value) => {
                if(value === null) return false;
                return value.toString().toLowerCase().includes(search.toLowerCase());
            });

            return searchCondition;  
        } else {
            if (option[searchMode.toLowerCase()].toLowerCase().includes(search.toLowerCase())) {
                return true;
            } else {
                return false;
            }
        }
    }

    const checkModeCondition = (option) => {
        return selectedOptions.map((option) => option[`id`]).includes(option[`id`]);
        // return selectedOptions.includes(option) ? true : false;
    }

    return (
        <Card id={uuid} className={`ComboBox`} style={{border: 'none', padding: '10px'}}>
            {/* header */}
            <Card.Header 
                style={{
                    display: 'flex'
                    , alignItems: 'center'
                    , alignContent: 'center'
                    , border: 'none'
                    , padding: '0px 0px 10px 0px'
                    , backgroundColor: 'transparent'
                }}
            >
                <InputGroup>
                    <Dropdown>
                        <Dropdown.Toggle
                            id={`dropdown-${uuid}`}
                            variant="primary-outline"
                            disabled={isLocked}
                            style={{
                                borderRadius: '5px 0px 0px 5px'
                                , border: '1px solid lightgray'
                                , boxShadow: '0px 1px 1px 0px lightgray'
                                , width: '12%'
                                , backgroundColor: 'white'
                            }}
                        >
                            {searchMode}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setSearchMode('All')}>
                                All
                            </Dropdown.Item>
                            {data.length > 0 && Object.keys(data[0]).map((key, index) => {
                                if(avoidColumns.includes(key)) return null;

                                return <Dropdown.Item
                                    key={`dropdown-item-${index}`}
                                    onClick={() => setSearchMode(key.charAt(0).toUpperCase() + key.slice(1))}
                                >
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </Dropdown.Item>
                            })}
                        </Dropdown.Menu>
                    </Dropdown>

                    <Form.Control
                        id={`combobox-search-${uuid}`}
                        type="text" 
                        placeholder={"Search " + searchMode.toLowerCase() + "..."}
                        style={{
                            borderRadius: '0px 5px 5px 0px'
                            , width: '88%'
                            , boxShadow: '0px 1px 1px 0px lightgray'
                        }}
                        value={search}
                        disabled={isLocked}
                        onChange={(e) => {
                            if(pattern && e.target.value !== "") {
                                const regex = new RegExp(pattern);
                                if(!regex.test(e.target.value)) {
                                    return
                                }
                            }
                            setSearch(e.target.value);
                        }}
                        onClick={() => {
                            document.getElementById('combobox-search-' + uuid).select()
                        }}
                    />
                </InputGroup>

                {editMode && !singleMode && <div style={{
                    border: '1px solid lightgray'
                    , borderRadius: '5px'
                    , padding: '5px'
                    , margin: '0px 0px 0px 6px'
                    , width: '12%'
                    , backgroundColor: 'white'
                    , boxShadow: '0px 1px 1px 0px lightgray'
                }}>
                    <Form.Check
                        id={`switch-display-mode-${uuid}`}
                        type="switch"
                        disabled={isLocked}
                        label={displayMode}
                        style={{marginLeft: '10px', marginTop: '2px', userSelect: 'none'}}
                        checked={displayMode === 'Selected'}
                        onChange={() => {
                            if(displayMode === 'All') {
                                setDisplayMode('Selected');
                            } else {
                                setDisplayMode('All');
                            }
                        }}
                    />
                </div>}

                <Button
                    className="ComboBox-lock-button"
                    onClick={handleLockClick}
                >
                    <FontAwesomeIcon icon={isLocked ? faLock : faLockOpen}/>
                </Button>

            </Card.Header>

            {/* table */}
            <Card.Body style={{padding: '0px', maxHeight: '327px', overflowY: 'auto'}}>
                <Table hover size="sm" style={{marginBottom: '0px'}}>
                    <thead style={{position: 'sticky', top: '0px', zIndex: '1', backgroundColor: 'white'}} >
                        <tr>
                            <th className='ComboBox-header-row' style={{width: '4%', paddingLeft: '10px', userSelect: 'none'}}></th>
                            {data.length > 0 && Object.keys(data[0]).map((key, index) => {
                                if(avoidColumns.includes(key)) return null;

                                return <th
                                    key={`option-${index}`}
                                    className="ComboBox-header-row"
                                    style={{ 
                                        paddingLeft: '10px'
                                        , userSelect: 'none'
                                    }}
                                >
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </th>
                            })}
                            {showQuantities && <th className='ComboBox-header-row' style={{width: '12%', paddingLeft: '10px', userSelect: 'none'}}>Quantity</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((option, index) => {
                            const displaySearchCondition = checkSearchCondition(option);
                            const displayModeCondition = checkModeCondition(option);
                            
                            if(displaySearchCondition === false) {
                                return null;
                            }

                            if(displayMode === 'Selected' && displayModeCondition === false) {
                                return null;
                            }

                            return renderRow({index})
                        })}
                    </tbody>
                </Table>
            </Card.Body>

            {/* selected row */}
            <Card.Footer style={{padding: '0px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 8px'}}>
                    <span style={{fontSize: '12px', color: 'gray', userSelect: 'none'}}>
                        {selectedOptions.length} selected
                    </span>
                    <span style={{fontSize: '12px', color: 'gray', userSelect: 'none'}}>
                        {data.length} total
                    </span>
                </div>
            </Card.Footer>
        </Card>
    );
}