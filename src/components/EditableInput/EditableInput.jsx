import React, { useRef } from 'react';
import { Badge } from 'react-bootstrap';
import './styles.css';

const EditableContent = () => {
    const contentEditable = useRef(null);

    const handleInput = () => {
      const formattedText = contentEditable.current.innerText;
      console.log(formattedText);
    };
  
    return (
      <div
        className="editable-content"
        contentEditable
        onInput={handleInput}
        ref={contentEditable}
      >
        <span style={{color: 'gray', backgroundColor: 'lightblue'}}>Type here...</span>

        <Badge pill bg="primary" className="ms-2" >
            tst
        </Badge>
      </div>
    );
  };

export default EditableContent;