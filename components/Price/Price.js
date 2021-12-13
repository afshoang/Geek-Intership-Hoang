import React, { useState, useCallback } from 'react';
import { FormLayout, Card, Stack, RadioButton} from "@shopify/polaris";
import ApplyPrice from './ApplyPrice';
import DecreaseAmount from './DecreaseAmount';
import DecreasePercentage from './DecreasePercentage';
import store from "store-js";

export default function Price({priceType, setPriceType, setApplyPrice, setDecreaseAmount, setDecreasePercentage, ruleName, setError}){
    const [custom, setCustom] = useState(priceType);
    const priceChange = useCallback(
        (_checked, newCustom) => {
          setCustom(newCustom)
          setPriceType(newCustom)
          
          if(ruleName.trim() === ""){
            setError("Please enter the pricing rule's name!")
            store.set("error", "Please enter the pricing rule's name!")
          }else{
            setError("")
            store.set("error", "")
          }
        },[ruleName],);

    return(
        <Card title="Custom Prices" sectioned>
            <FormLayout>
              <Stack vertical>
                <RadioButton
                  label="Apply a price to selected products"
                  checked={custom === 'apply_price'}
                  id="apply_price"
                  name="price"
                  onChange={priceChange}
                />
                <RadioButton
                  label="Decrease a fixed amount of the original prices of selected products"
                  id="decrease_amount"
                  name="price"
                  checked={custom === 'decrease_amount'}
                  onChange={priceChange}
                />
                <RadioButton
                  label="Decrease the original prices of selected products by a percentage (%)"
                  id="decrease_percentage"
                  name="price"
                  checked={custom === 'decrease_percentage'}
                  onChange={priceChange}
                />
              </Stack>
              {custom === "apply_price" && <ApplyPrice setApplyPrice={(e)=>setApplyPrice(e)} ruleName={ruleName} setError={(e)=>setError(e)}/>}
              {custom === "decrease_amount" && <DecreaseAmount setDecreaseAmount={(e)=>setDecreaseAmount(e)} />}
              {custom === "decrease_percentage" && <DecreasePercentage setDecreasePercentage={(e)=>setDecreasePercentage(e)} />}
            </FormLayout>
        </Card>
    );
}

