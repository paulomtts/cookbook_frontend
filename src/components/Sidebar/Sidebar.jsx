/* Foreign dependencies */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* Local dependencies */
import "./Sidebar.css";


export default function Sidebar({
    menus = [],
    onClickMenuItem = () => {},
}) {
    return (<>
        <div className="flex vertical Sidebar center-h fade-in-long">
            <div className="flex vertical">
                {menus.map((menu) => {
                    return (<div key={menu.key} className="text item" onClick={() => onClickMenuItem(menu.key)}>
                        <FontAwesomeIcon icon={menu.icon} className="icon"/>
                        {menu.label}
                    </div>);
                })}
            </div>

            {/* <div className="background-image"/> */}
        </div>
    </>);   
}