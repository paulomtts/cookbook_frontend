/* Foreign dependencies */
import { useContext } from "react";
import { Form } from "react-bootstrap";

/* Local dependencies */
import { ComboBoxContext } from "../ComboBox";

export default function SearchInput(){
    const { lock, searchFor, handleSearchForChange } = useContext(ComboBoxContext);

    return(<>
        <Form.Control
            className="ComboBox-search-bar"
            type="text" 
            value={searchFor}
            disabled={lock}
            onChange={handleSearchForChange}
        />
    </>)
}