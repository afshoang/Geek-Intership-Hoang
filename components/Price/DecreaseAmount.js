import React, { useState, useCallback } from 'react';
import { TextField } from "@shopify/polaris";
import store from 'store-js';

export default function DecreaseAmount({setDecreaseAmount}){
    const [inputValue, setInputValue] = useState((store.get("decrease amount") === undefined) ? '':store.get("decrease amount"));

    const handleTextFieldChange = useCallback(
        (value) => {
            setInputValue(value);
            setDecreaseAmount(value);
            store.set("decrease amount", value);
        },[],);

    return(
        <TextField label="Decrease amount" type="number" value={inputValue} onChange={handleTextFieldChange} placeholder={0} prefix="đ"/>
    )
}