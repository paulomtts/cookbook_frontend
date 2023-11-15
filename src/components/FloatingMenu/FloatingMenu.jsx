import React, { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faEdit, faBowlFood } from "@fortawesome/free-solid-svg-icons";

import FloatingMenuButton from "./FloatingMenuButton";
import "./FloatingMenu.css";

export default function FloatingMenu(props) {

    const [expanded, setExpanded] = useState(false)

    return(<>
        <div 
            className={`Menu`}
            onMouseEnter={() => setExpanded(true)}  
            onMouseLeave={() => setExpanded(false)}
        >
            <FontAwesomeIcon icon={faBars} className={`Menu-icon ${expanded ? 'expanded' : ''}`} />
            {expanded && <div className="Menu-button-container fade-in">  
                <FloatingMenuButton title="Registry" icon={faEdit} onClick={() => props.onClickButton('registry')} />
                <FloatingMenuButton title="Recipes" icon={faBowlFood} onClick={() => props.onClickButton('recipes')}/>
            </div>}
        </div>
    </>);
}