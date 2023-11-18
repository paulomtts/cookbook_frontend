/* Foreign dependencies */
import React, { createContext, useEffect, useState, useRef } from "react";
import { Card } from "react-bootstrap";

/* Local dependencies */
import { getFields } from "../../core/utilities";
import { useToggle } from "../../hooks/useToggle";
import { useRearm } from "../../hooks/useRearm";
import ComboBoxToolbar from "./Toolbar/ComboBoxToolbar";
import ComboBoxTable from "./Table/ComboBoxTable";
import ComboBoxInfo from "./InfoBar/ComboBoxInfo";
import "./ComboBox.css";


const ComboBoxContext = createContext();
const { Provider } = ComboBoxContext;


/**
 * A component that renders a combo box with various features such as search, selection, and quantity management.
 * @param {Object} props - The component props.
 * @param {Array} props.data - The data to be displayed in the combo box.
 * @param {string} props.pattern - The pattern to be used for searching.
 * @param {Array} props.avoid - The fields to be avoided in the search.
 * @param {boolean} [props.selectable=false] - Whether the combo box is selectable or not.
 * @param {boolean} [props.single=false] - Whether only one row can be selected at a time or not.
 * @param {boolean} [props.editable=false] - Whether the quantity of each row can be edited or not.
 * @param {boolean} [props.quantities=false] - Whether the combo box should manage quantities or not.
 * @param {boolean} [props.footer=false] - Whether to display a footer or not.
 * @param {Object} [props.customColumns={}] - The custom columns to be displayed in the combo box. The keys work as 
 * the column title, while the values are the component type to be rendered. Note that these components will receive
 * standard onClick and onChange props, which will be handled by the combo box.
 * @param {boolean} [props.lockTrigger=null] - The trigger for locking the combo box. Receives a boolean value.
 * @param {boolean} [props.displayTrigger=null] - The trigger for changing the display mode. Receives either "all" or "selected".
 * @param {Array} [props.selectedRowsTrigger=null] - The trigger for selecting rows. Receives an array of rows.
 * @param {Function} [props.onClickRow=() => {}] - The function to be called when a row is clicked.
 * @param {Function} [props.onClickDelete=() => {}] - The function to be called when a row is deleted.
 * @param {Function} [props.onChangeQuantity=() => {}] - The function to be called when the quantity of a row is changed.
 * @returns {JSX.Element} The combo box component.
 */
export default function ComboBox (props) {
    const {
        data, pattern, avoid, selectable = false, single = false, editable = false, quantities = false, footer = false

        , customComponents = {}
        
        , lockTrigger = null
        , displayTrigger = null
        , selectedRowsTrigger = null

        , onClickRow = () => {} // receives selectedRows, row
        , onClickDelete = () => {} // receives row
        , onChangeQuantity = () => {} // receives quantitiesData, row
    } = props;

    const fields = getFields(data, avoid);
    const { status: lock, toggleStatus: toggleLock, setStatus: setLock } = useToggle();
    const { status: display, toggleStatus: toggleDisplay, setStatus: setDisplay } = useToggle("all", ["all", "selected"]);
    const [searchIn, setSearchIn] = useState("all");
    const [searchFor, setSearchFor] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);

    /////////////////////////////////////////////////////////
    // const [quantitiesData, setQuantitiesData] = useState({});
    const [customData, setCustomData] = useState({});


    /* Hooks */
    useEffect(() => {
        const newCustomData = {};
        Object.keys(customComponents).map((key) => {
            newCustomData[key] = {};
        });
    }, [data]); // reason: setup customData

    //////////////////////////////////////////////////////////

    useEffect(() => {
        if(!lockTrigger) return;
        setLock(lockTrigger);
    }, [lockTrigger]);

    useEffect(() => {
        if(!displayTrigger) return;
        setDisplay(displayTrigger);
    }, [displayTrigger]);

    useEffect(() => {
        if(!selectedRowsTrigger) return;
        setSelectedRows(selectedRowsTrigger??[]);
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
        setDisplay(lock ? "all" : "selected");
        toggleLock();
        setSearchFor("");
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
     * Triggers the onChangeQuantity prop, passing the quantities data and the clicked row as arguments.
     * @param {Object} row - The row object that was clicked.
     * @returns {void}
     */
    const handleClickRow = (row) => {
        if(lock) return;
        if(single && selectedRows.includes(row)) return;

        let newSelectedRows;
        let newQuantitiesData

        if(!single && selectedRows.map((selRow) => selRow[`id`]).includes(row[`id`])) {
            newSelectedRows = selectedRows.filter((selRow) => selRow[`id`] !== row[`id`]);
            newQuantitiesData = {...quantitiesData, [row[`id`]]: 0};

        } else {
            if(single) {
                newSelectedRows = [row];
            } else {
                newSelectedRows = [...selectedRows, row];
            }
            
            newQuantitiesData = {...quantitiesData, [row[`id`]]: 1};
        }
        
        setSelectedRows(newSelectedRows);
        setQuantitiesData(newQuantitiesData);
        
        onChangeQuantity(newQuantitiesData, row);
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
     * Handles the change of quantity for a given row.
     * 
     * This also triggers the onChangeQuantity prop, passing the quantities data and the row as arguments.
     * @param {Object} row - The row object.
     * @param {number} value - The new quantity value.
     */
    const handleQuantityChange = (row, value) => {
        setQuantitiesData({...quantitiesData, [row[`id`]]: value});
        if (value < 1) {
            setSelectedRows(selectedRows.filter((selRow) => selRow[`id`] !== row[`id`]));
        }

        onChangeQuantity({...quantitiesData, [row[`id`]]: value}, row);
    }


    /* Virtualized list component */
    const containerRef = useRef(null);

    /* Context */
    const value = {
        data
        , customColumns
        , containerRef
        , fields
        , pattern
        , checkDisplay
        , selectedRowsTrigger
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

export { ComboBoxContext };