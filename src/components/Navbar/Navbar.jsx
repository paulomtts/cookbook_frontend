import React from "react";


import NavbarItem from "./NavbarItem";
import "./Navbar.css";


export default function Navbar(props) {
    return (<>
        <div className="Navbar">
            <NavbarItem text="Recipes" onClick={() => props.onClickItem('recipes')}/>
            <NavbarItem text="Ledger" onClick={() => props.onClickItem('registry')}/>
        </div>
    </>);
}