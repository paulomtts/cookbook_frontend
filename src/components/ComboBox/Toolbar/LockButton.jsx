/* Foreign dependencies */
import { useContext } from 'react';
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';

/* Local dependencies */
import { ComboBoxContext } from "../ComboBox";


export default function LockButton() {

    const { lock, handleLockClick } = useContext(ComboBoxContext);

    return(<>
        <Button
            className="ComboBox-lock-button"
            onClick={handleLockClick}
        >
            <FontAwesomeIcon icon={lock ? faLock : faLockOpen}/>
        </Button>
    </>)
}