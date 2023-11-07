/* Foreign dependencies */
import React, { createContext, useEffect, useState } from "react";

/* Local dependencies */
import { useDataFetcher } from "../../hooks/useDataFetcher";
// import { useData } from "../../core/dataContext";


const FormContainerContext = createContext();
const { Provider } = FormContainerContext;

function FormContainer({
    children
}) {
    // const dataContext = useData();

    const [comboboxData, setComboboxData] = useDataFetcher("recipe_composition_initial");
    const [comboboxSelectedRows, setComboboxSelectedRows] = useState([]);
    const [comboboxQuantitiesData, setComboboxQuantitiesData] = useState({});

    
    /* Effects */
    // useEffect(() => {
    //     const getData = async () => {
    //         const { json } = await dataContext.fetchData("recipe_composition_initial", {}, false);
    //         const newComboboxData = await JSON.parse(json.data);
    //         setComboboxData(newComboboxData);
    //     }
    //     getData();
    // }, []);


    /* Events */
    const onClickComboBoxRow = (row) => {
        // console.log('Clicked', {...row});
        // if(comboboxSelectedRows.includes(row)) {
        //     setComboboxSelectedRows(comboboxSelectedRows.filter(selRow => selRow !== row));
        // } else {
        //     setComboboxSelectedRows([...comboboxSelectedRows, row]);
        // }
    }

    const onClickComboBoxDelete = (row) => {
        // console.log('Deleted', row);
        // if(comboboxSelectedRows.includes(row)) {
        //     setComboboxSelectedRows(comboboxSelectedRows.filter(selRow => selRow !== row));
        // }
    }

    const onChangeComboBoxQuantity = (row, value) => {
        // console.log('Changed', row, '-> value:', value);
        // const newQuantitiesData = {...comboboxQuantitiesData};
        // newQuantitiesData[row[`id`]] = value;
        // setComboboxQuantitiesData(newQuantitiesData);
    }

    const value = {
        comboboxData
        , onClickComboBoxRow
        , onClickComboBoxDelete
        , onChangeComboBoxQuantity
    }

    return(<>
        <Provider value={value}>
            {children}
        </Provider>
    </>);
}

export { FormContainer, FormContainerContext };