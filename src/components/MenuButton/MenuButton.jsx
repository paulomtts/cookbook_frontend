import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faEdit, faPen } from "@fortawesome/free-solid-svg-icons";

import "./MenuButton.css";
import "@material/web/button/filled-button.js"

export default function MenuButton(props) {
    const [showLabel, setShowLabel] = useState(false);

    return (<>
        <button 
            className="Menu-Button" 
            onClick={props.onClick} 
            onMouseOver={() => setShowLabel(true)}
            onMouseLeave={() => setShowLabel(false)}
        >
            <FontAwesomeIcon className={`Menu-Button-icon ${showLabel ? "": "fade-out"}`} icon={faBars} />
            <span 
                className="Menu-Button-label fade-in"
                style={{
                    display: showLabel ? "inline-block" : "none"
                }}
            >
                Menu
            </span>
        </button>

    </>);
}