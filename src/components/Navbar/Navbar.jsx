import React from "react";

import "./Navbar.css";

function NavbarItem(props) {
    return (<>
        <span className="Navbar-item" onClick={props.onClick}>
            {props.text}
        </span>
    </>);
}


export default function Navbar(props) {
    return (<>
        <div className="Navbar">
            <NavbarItem text="Recipes" onClick={() => props.onClickItem('recipes')}/>
            <NavbarItem text="Ledger" onClick={() => props.onClickItem('registry')}/>
        </div>
    </>);
}