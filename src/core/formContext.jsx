/*Foreign dependencies*/
import React, { useContext, createContext } from "react";

const FormContext = createContext();

export function FormProvider({ children }) {

    /**
     * Include here functions to deal with data comparison and validation
     */

    return (
        <FormContext.Provider>
            {children}
        </FormContext.Provider>
    )
}

export function useForm() {
    return useContext(FormContext);
}