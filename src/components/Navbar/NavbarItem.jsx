import React from "react";

import "./Navbar.css";

export default function NavbarItem(props) {
    return (<>
        <span className="Navbar-item" onClick={props.onClick}>
            {props.text}
        </span>
    </>);
}
