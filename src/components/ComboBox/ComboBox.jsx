/* Foreign dependencies */
import React, { createContext, useEffect, useState, useContext } from "react";
import { Card } from "react-bootstrap";

/* Local dependencies */
import { useToggle } from "./useToggle";
import ComboBoxToolbar from "./Toolbar/ComboBoxToolbar";
import ComboBoxTable from "./Table/ComboBoxTable";
import ComboBoxInfo from "./InfoBar/ComboBoxInfo";
import { getFields } from "../../core/utilities";
import "./ComboBox.css";


const ComboBoxContext = createContext();
const { Provider } = ComboBoxContext;


function ComboBox ({
    data, pattern, avoid, selectable = false, editable = false, quantities = false, footer = false, parentContext
}) {

    const { 
        onClickComboBoxRow: parentOnClickRow = () => {}
        , onClickComboBoxDelete: parentOnClickDelete = () => {}
        , onChangeComboBoxQuantity: parentOnChangeQuantity = () => {}
        , comboboxData: parentData = []
    } = parentContext ? useContext(parentContext) : {};

    
    if(parentContext) {
        data = parentData;
    }
    
    const fields = getFields(data, avoid);
    const { status: lock, toggleStatus: toggleLock, setStatus: setLock } = useToggle();
    const { status: display, toggleStatus: toggleDisplay, setStatus: setDisplay } = useToggle("all", ["all", "selected"]);
    const [searchIn, setSearchIn] = useState("all");
    const [searchFor, setSearchFor] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [quantitiesData, setQuantitiesData] = useState({});
    
    
    /* Effects */
    useEffect(() => {
        if(!quantities || !data) return;
        
        const newQuantitiesData = data.reduce((acc, row) => {
            acc[row[`id`]] = row[`quantity`]??0;
            return acc;
        }, {});

        setQuantitiesData(newQuantitiesData);
    }, [data]); // reason: setup quantities


    /* Methods */
    const checkDisplayConditions = (row) => {
        if (searchFor) {

            const values = searchIn === "all" ? 
                fields.map((field) => row[field])
                : 
                [row[searchIn]];

            const found = values.filter((value) => {
                if (typeof value !== "string") return false;
                return value.toString().toLowerCase().includes(searchFor.toLowerCase());
            });

            if (found.filter(String).length === 0) return false;
        }

        if (display === "selected" && !selectedRows.map((selRow) => selRow[`id`]).includes(row[`id`]))
            return false;

        return true;
    };


    /* Events */
    const handleLockClick = () => {
        setDisplay(lock ? "all" : "selected");
        toggleLock();
        setSearchFor("");
    }

    const handleSwitchClick = () => {
        toggleDisplay();
    }

    const handleSearchInClick = (key) => {
        setSearchIn(key);
    }

    const handleSearchForChange = (e) => {
        if(pattern && e.target.value !== "") {
            const regex = new RegExp(pattern);

            if(!regex.test(e.target.value)) {
                return
            }
        }
        setSearchFor(e.target.value);  
    }
    
    const handleClickRow = (row) => {
        if(lock) return;

        if(selectedRows.map((selRow) => selRow[`id`]).includes(row[`id`])) {
            setSelectedRows(selectedRows.filter((selRow) => selRow[`id`] !== row[`id`]));
            quantitiesData[row[`id`]] = 0;
        } else {
            setSelectedRows([...selectedRows, row]);
            if(quantitiesData[row[`id`]] > 0 ) {
                parentOnClickRow(row);
                return;
            }
            setQuantitiesData({...quantitiesData, [row[`id`]]: 1});
        }

        parentOnClickRow(row);
    }

    const handleClickDelete = (row) => {
        parentOnClickDelete(row);
    }

    const handleQuantityChange = (row, value) => {
        setQuantitiesData({...quantitiesData, [row[`id`]]: value});
        parentOnChangeQuantity(row, value);
    }


    /* Context */
    const value = {
        data
        , fields
        , pattern
        , checkDisplayConditions
        , selectable
        , editable
        , quantities
        , lock, toggleLock
        , display, toggleDisplay, setDisplay
        , searchIn, setSearchIn
        , searchFor, setSearchFor
        , selectedRows, setSelectedRows
        , quantitiesData, setQuantitiesData
        , handleLockClick, handleSwitchClick, handleSearchInClick, handleSearchForChange
        , handleClickRow, handleClickDelete, handleQuantityChange
    }

    return (<>
        <Provider value={value}>
            <Card className="ComboBox">

                <Card.Header className="ComboBox-header">
                    <ComboBoxToolbar  />
                </Card.Header>

                {data.length > 0 &&
                <Card.Body className="ComboBox-body">
                    <ComboBoxTable />
                </Card.Body>}

                {footer &&
                <Card.Footer className='ComboBox-footer'>
                    <ComboBoxInfo />
                </Card.Footer>}

            </Card>
        </Provider>
    </>);
}

export { ComboBox, ComboBoxContext };