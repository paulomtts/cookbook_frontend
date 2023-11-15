import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function FloatingMenuButton(props) {

    return (<>
        <button
            className="Menu-button"
            onClick={props.onClick}
        >
            <FontAwesomeIcon icon={props.icon} className="Menu-button-icon" />
            <span className="Menu-button-label">{props.title}</span>
        </button>
    </>);
}