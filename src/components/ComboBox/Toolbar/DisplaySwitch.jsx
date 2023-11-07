/* Foreign dependencies */
import { useContext } from "react";
import { Form } from "react-bootstrap";

/* Local dependencies */
import { ComboBoxContext } from "../ComboBox";


export default function DisplaySwitch() {
    
    const { display, lock, handleSwitchClick } = useContext(ComboBoxContext);

    return(<>
        <div className="ComboBox-switch">
        <Form.Check
            type="switch"
            disabled={lock}
            checked={display === 'selected'}
            label={display === 'selected' ? 'Selected' : 'All'}
            onChange={handleSwitchClick}
        />
        </div>
    </>)
}