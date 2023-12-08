/* Foreign dependencies */
import React, { createContext, useEffect, useState, useRef } from "react";
import { Card } from "react-bootstrap";

/* Local dependencies */
import { getFields } from "../../core/utilities";
import { useToggle } from "../../hooks/useToggle";
import ComboBoxToolbar from "./Toolbar/ComboBoxToolbar";
import ComboBoxTable from "./Table/ComboBoxTable";
import ComboBoxInfo from "./InfoBar/ComboBoxInfo";
import "./combobox.css";


const ComboBoxContext = createContext();
const { Provider } = ComboBoxContext;


export default function ComboBox (props) {
    const {
        data
        , pattern
        , avoid
        , rename = {}
        , selectable = false
        , single = false
        , editable = false
        , footer = false

        , avoidSearch = []

        , customComponents = {}
        
        , lockTrigger = null
        , displayTrigger = null
        , selectedRowsTrigger = null

        , onClickRow = () => {} // receives selectedRows, row
        , onClickDelete = () => {} // receives row
        , onChangeCustomData = () => {} // receives customData, row
    } = props;

    const fields = getFields(data, avoid);

    const { status: lock, toggleStatus: toggleLock, setStatus: setLock } = useToggle();
    const { status: display, toggleStatus: toggleDisplay, setStatus: setDisplay } = useToggle("all", ["all", "selected"]);

    const [searchIn, setSearchIn] = useState("all");
    const [searchFor, setSearchFor] = useState("");

    const [customData, setCustomData] = useState({});
    const [selectedRows, setSelectedRows] = useState([]);


    /* Hooks */
    useEffect(() => {
        const newCustomData = {};

        data.forEach((row) => {
            Object.keys(customComponents).map((key) => {
                if(newCustomData[key] === undefined) newCustomData[key] = {};

                newCustomData[key][row[`id`]] = row[key]??"";
            });
        });

        setCustomData(newCustomData);
        onChangeCustomData(newCustomData);
    }, [data]); // reason: setup customData

    useEffect(() => {
        if(lockTrigger === null) return;
        setLock(lockTrigger);
    }, [lockTrigger]);

    useEffect(() => {
        if(displayTrigger === null) return;
        setDisplay(displayTrigger);
    }, [displayTrigger]);

    useEffect(() => {
        if(selectedRowsTrigger === null) return;
        setSelectedRows(selectedRowsTrigger);
    }, [selectedRowsTrigger]);


    /* Methods */
    /**
     * Determines whether a row should be displayed based on search criteria and display mode.
     * @param {Object} row - The row to be checked.
     * @returns {boolean} - True if the row should be displayed, false otherwise.
     */
    const checkDisplay = (row) => {
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

        if (display === "selected" && !(selectedRowsTrigger??selectedRows).map((selRow) => selRow[`id`]).includes(row[`id`]))
            return false;

        return true;
    };


    /* Events */
    const handleLockClick = () => {
        if (selectable) setDisplay(lock ? "all" : "selected");
        toggleLock();
        if (selectable) setSearchFor("");
    }

    const handleSwitchClick = () => {
        toggleDisplay();

        if(containerRef.current) {
            containerRef.current.scrollTop = 0;
        }
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
    
    /**
     * Handles the click event on a row in the ComboBox component.
     * 
     * Triggers the onClickRow prop, passing the selected rows and the clicked row as arguments.
     * Triggers the onCustomDataChange prop, passing the new custom data and the clicked row as arguments.
     * @param {Object} row - The row object that was clicked.
     * @returns {void}
     */
    const handleClickRow = (row) => {
        if(lock) return;
        if(single && selectedRows.includes(row)) return;

        let newSelectedRows;

        let newCustomData = {...customData};
        
        if(!single && selectedRows.map((selRow) => selRow[`id`]).includes(row[`id`])) {
            newSelectedRows = selectedRows.filter((selRow) => selRow[`id`] !== row[`id`]);
            Object.keys(customComponents).forEach((key) => {
                newCustomData[key][row['id']] = 0;
            });

        } else {
            if(single) {
                newSelectedRows = [row];
            } else {
                newSelectedRows = [...selectedRows, row];
            }

            Object.keys(customComponents).forEach((key) => {
                newCustomData[key][row['id']] = customComponents[key].defaultValue;
            });
        }

        setCustomData(newCustomData);
        onChangeCustomData(newCustomData, row);

        setSelectedRows(newSelectedRows);
        onClickRow(newSelectedRows, row);
    }

    /**
     * Handles the click event for the delete button.
     * 
     * This also triggers the onClickDelete prop, passing the clicked row as an argument.
     * @param {Object} row - The row to be deleted.
     */
    const handleClickDelete = (row) => {
        onClickDelete(row);
    }


    /**
     * Handles the change of custom data for a specific row.
     * @param {object} row - The row object.
     * @param {string} key - The key of the custom data.
     * @param {any} value - The new value for the custom data.
     */
    const handleCustomDataChange = (row, key, value) => {
        const newCustomData = {...customData, [key]: {...customData[key], [row[`id`]]: value}};

        if (key === 'quantity' && value < 1) {
            Object.keys(customComponents).forEach((customKey) => {
                if(customKey !== key){
                    newCustomData[customKey][row['id']] = 0;
                }
            });
            setSelectedRows(selectedRows.filter((selRow) => selRow[`id`] !== row[`id`]));
        } else if (key === 'quantity' && value > 0) {
            Object.keys(customComponents).forEach((customKey) => {
                if(customKey !== key){
                    newCustomData[customKey][row['id']] = customComponents[customKey].defaultValue;
                }
            });
            setSelectedRows([...selectedRows, row]);
        }
        
        
        setCustomData(newCustomData);
        onChangeCustomData(newCustomData, row);
    }


    /* Virtualized list component */
    const containerRef = useRef(null);

    /* Context */
    const value = {
        data
        , tableContainerClassName: props.tableContainerClassName
        , containerRef
        , fields
        , rename
        , pattern
        , checkDisplay
        , selectedRowsTrigger
        , selectable
        , editable
        , avoidSearch
        , customComponents
        , lock, toggleLock
        , display, toggleDisplay, setDisplay
        , searchIn, setSearchIn
        , searchFor, setSearchFor
        , selectedRows, setSelectedRows
        , customData, setCustomData
        , handleLockClick, handleSwitchClick, handleSearchInClick, handleSearchForChange
        , handleClickRow, handleClickDelete, handleCustomDataChange
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

export { ComboBoxContext };