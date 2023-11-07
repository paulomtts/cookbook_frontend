/* Foreign dependencies */
import React from "react";
import { InputGroup } from "react-bootstrap";

/* Local dependencies */
import SearchDropdown from "./SearchDropdown";
import SearchInput from "./SearchInput";
import DisplaySwitch from "./DisplaySwitch";
import LockButton from "./LockButton";

export default function ComboBoxToolbar() {
    return(<>
        <InputGroup>
            <SearchDropdown />
            <SearchInput/>
        </InputGroup>
        <DisplaySwitch />
        <LockButton />
    </>)
}