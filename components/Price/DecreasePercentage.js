import React, { useState, useCallback } from 'react';
import { TextField } from "@shopify/polaris";
import store from 'store-js';

export default function DecreasePercentage({setDecreasePercentage}){
    const [inputValue, setInputValue] = useState((store.get("decrease percentage") === undefined) ? '':store.get("decrease percentage"));

    const handleTextFieldChange = useCallback(
        (value) => {
            setInputValue(value);
            setDecreasePercentage(value);
            store.set("decrease percentage", value);
        },[],);

    return(
        <TextField label="Decrease percent" value={inputValue} onChange={handleTextFieldChange} suffix="%"/>
    )
}