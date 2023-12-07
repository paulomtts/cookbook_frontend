/* Foreign dependencies */
import { useContext } from "react";
import { Dropdown } from "react-bootstrap";

/* Local dependencies */
import { ComboBoxContext } from "../ComboBox";

export default function SearchInput(){
    const { fields, avoidSearch, lock, searchIn, handleSearchInClick } = useContext(ComboBoxContext);

    return(<>
        <Dropdown>
            <Dropdown.Toggle
                className="ComboBox-dropdown"
                variant="primary-outline"
                disabled={lock}
            >
                {searchIn.charAt(0).toUpperCase() + searchIn.slice(1)}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item 
                    className="ComboBox-dropdown-item"
                    onClick={() => handleSearchInClick("all")}
                >
                    All
                </Dropdown.Item>
                {fields.map((key, index) => {
                    if(avoidSearch.includes(key)) return null;
                    return <Dropdown.Item
                        key={`dropdown-item-${index}`}
                        className="ComboBox-dropdown-item"
                        onClick={() => handleSearchInClick(key)}
                    >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Dropdown.Item>
                })}
            </Dropdown.Menu>
        </Dropdown>
    </>)
}