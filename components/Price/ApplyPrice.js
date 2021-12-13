import React, { useState, useCallback } from 'react';
import { TextField } from "@shopify/polaris";
import store from "store-js";

export default function ApplyPrice({setApplyPrice, ruleName, setError}){
    const [inputValue, setInputValue] = useState((store.get("apply price") === undefined) ? '':store.get("apply price"));

    const handleTextFieldChange = useCallback(
        (value) => {
            setInputValue(value)
            setApplyPrice(value)
            store.set("apply price", value);
            if(ruleName.trim() === ""){
                setError("Please enter the pricing rule's name!")
                store.set("error", "Please enter the pricing rule's name!")
            }else{
                setError("")
                store.set("error", "")
            }
        },[ruleName],);

    return(
        <TextField label="Amount" type="number" value={inputValue} onChange={handleTextFieldChange} placeholder={0} prefix="đ"/>
    )
}