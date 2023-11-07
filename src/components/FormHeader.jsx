/* Foreign dependencies */
import React from "react";
import { Image } from "react-bootstrap";


export default function FormHeader({
    id
    , imgSrc
    , title
    , text
}) {
    return (<>
        <Image id={id} className={`generic-form-image`} src={imgSrc} />
        
        <h2 className={`generic-form-title`}>
            {title.charAt(0).toUpperCase() + title.slice(1)}
        </h2>

        <p className={`recipe-form-text`}>
            {text}
        </p>
    </>)
}