import React, { useState, useEffect } from "react";
import { Image, Col, Row } from "react-bootstrap";

import NavbarItem from "./NavbarItem";
import "./Navbar.css";



export default function Navbar(props) {
    const [prevScrollPos, setPrevScrollPos] = useState(window.scrollY);
    const [scrollDirection, setScrollDirection] = useState("down"); 

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;
            if (prevScrollPos > currentScrollPos) {
                setScrollDirection("up");
            } else if (prevScrollPos < currentScrollPos) {
                setScrollDirection("down");
            }
            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, [prevScrollPos]);

    return (<>
        <div className={`Navbar ${scrollDirection === "down" ? "slide-out" : "slide-in"}`}>
            <NavbarItem
                text="Recipes"
                onClick={() => props.onClickItem("recipes")}
                />
            <NavbarItem
                text="Ledger"
                onClick={() => props.onClickItem("registry")}
                />
            <Image roundedCircle fluid src={`${props.imgSrc}`} style={{height: '100px', width: '100px'}}/>
        </div>
    </>);
}