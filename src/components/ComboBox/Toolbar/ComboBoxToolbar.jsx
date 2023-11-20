/* Foreign dependencies */
import React, { useContext } from "react";
import { InputGroup } from "react-bootstrap";

/* Local dependencies */
import SearchDropdown from "./SearchDropdown";
import SearchInput from "./SearchInput";
import DisplaySwitch from "./DisplaySwitch";
import LockButton from "./LockButton";
import { ComboBoxContext } from "../ComboBox";

export default function ComboBoxToolbar() {

    const { selectable } = useContext(ComboBoxContext);

    return(<>
        <InputGroup>
            <SearchDropdown />
            <SearchInput/>
        </InputGroup>
        {selectable && <DisplaySwitch />}
        <LockButton />
    </>)
}