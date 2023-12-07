import React from "react";
import { Button } from "react-bootstrap";

import { api } from "../../core/dataContext";
import NavbarItem from "./NavbarItem";
import ConfirmationPopover from "../ConfirmationPopover/ConfirmationPopover";
import "./Navbar.css";



export default function Navbar(props) {
    
    const logout = async () => {
        await fetch(api.auth.logout, {
            method: "GET",
            credentials: "include",
        })
        .then((response) => {
            console.log(response)
            if (response.status === 200) {
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
    </>);
}