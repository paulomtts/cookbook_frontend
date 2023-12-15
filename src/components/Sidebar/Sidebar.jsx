/* Foreign dependencies */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { Image } from "react-bootstrap";

/* Local dependencies */
import { api } from "../../core/dataContext";
import { useConfigs } from "../../core/configsContext";
import ConfirmationPopover from "../ConfirmationPopover/ConfirmationPopover";
import "./Sidebar.css";


export default function Sidebar({
    menus = [],
    onClickMenuItem = () => {},
}) {
    const { user } = useConfigs();


    const logout = async () => {
        await fetch(api.auth.logout, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
        })
        .then((response) => {
            if (response.ok) {
                window.location.reload();
            }
        });
    }   
    
    return (<>
        <div className="sticky Sidebar flex vertical justify-between fade-in-long">
           

            <div className="flex vertical gap-4">
                

                <div className="flex align-center justify-between gap-2 User" onClick={() => onClickMenuItem('profile')}>
                    <span className="no-select">{user.name}</span>
                    <Image
                        className="Image"
                        src={user.picture}
                        roundedCircle
                    />
                </div>
                
                {menus.map((menu) => {
                    return (
                        <div key={menu.key}>
                            
                            <div className="Text Menu flex align-center justify-center gap-4" onClick={() => onClickMenuItem(menu.key)}>
                                <FontAwesomeIcon icon={menu.icon} className="Icon"/>
                                {menu.label}
                            </div>

                            <div className="flex vertical align-center gap-1 fade-in-long">
                                {menu.submenus.map((submenu) => {
                                    return (
                                        <div key={submenu.key} className="Submenu" onClick={() => onClickMenuItem(submenu.key)}>
                                            {submenu.label}
                                        </div>
                                    );
                                })}
                            </div>

                        </div>
                    );
                })}


            </div>

            <ConfirmationPopover
                title="Are you sure?"
                text="Any unsaved changes will be lost." 
                placement={'top'}
                onYes={logout}
                style={{ marginLeft: "auto", zIndex: '2' }}
            >
                <div key='logout' className="Text Menu flex justify-center align-center gap-4" onClick={() => {}}>
                    <FontAwesomeIcon icon={faRightFromBracket} className="icon"/>
                    Logout
                </div>
            </ConfirmationPopover>
        </div>
    </>);   
}