import React from "react";
import { Button, Image } from "react-bootstrap";

import { api } from "../../core/dataContext";
import { useConfigs } from "../../core/configsContext";
import NavbarItem from "./NavbarItem";
import ConfirmationPopover from "../ConfirmationPopover/ConfirmationPopover";
import "./Navbar.css";



export default function Navbar(props) {
    const { user } = useConfigs();
    
    const logout = async () => {
        await fetch(api.auth.logout, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
        })
        .then((response) => {
            console.log(response)
            if (response.ok) {
                window.location.reload();
            }
        });
    }

    return (<>
        <div className={`Navbar`}>
            <NavbarItem
                text="Recipes"
                onClick={() => props.onClickItem("recipes")}
            />
            <NavbarItem
                text="Ledger"
                onClick={() => props.onClickItem("registry")}
            />

            <div className="logout-container">
                <span>{user.name}</span>
                <Image
                    src={user.picture}
                    roundedCircle
                    style={{ width: "40px", height: "40px", marginRight: "10px" }}
                />

                <ConfirmationPopover 
                    title="Logout"
                    text="Are you sure you want to logout?" 
                    placement={'bottom'}
                    onYes={logout}
                    style={{ marginLeft: "auto", zIndex: '2' }}
                >
                    <Button
                        className="NavbarButton"
                        variant="outline-light"
                        >
                        Logout
                    </Button>
                </ConfirmationPopover>
            </div>
        </div>
    </>);
}