import { FormLayout, Card, TextField, Select } from "@shopify/polaris";
import React, { useState, useCallback } from 'react';
import store from 'store-js';

export default function Infomation({ruleName, setRuleName, error, setError}){
    const [priority, setPriority] = useState((store.get("priority") === undefined) ? '0':store.get("priority"));
    const [errorPriority, setErrorPriority] = useState('');
    const [status, setStatus] = useState((store.get("status") === undefined) ? 'enable':store.get("status"));
    
    const nameChange = useCallback(
      (newName) => {
        setRuleName(newName);
        store.set("name", newName);
        
        if(newName.trim() === ''){
          setError("Please enter the pricing rule's name!");
          store.set("error", "Please enter the pricing rule's name!");
        }else{
          setError("");
          store.set("error", "");
        }
      },
      [ruleName],
    )

    const priorityChange = useCallback(
      (newPriority) => {
        setPriority(newPriority);
        store.set("priority", newPriority);
        if(ruleName.trim() === ''){
          setError("Please enter the pricing rule's name!");
          store.set("error", "Please enter the pricing rule's name!");
        }else{
          setError("");
          store.set("error", "");
        }

        if(newPriority>99 || newPriority<0 || newPriority.trim() === ''){
          setErrorPriority("Please enter an integer from 0 to 99!");
        }else{
          setErrorPriority("");
        }
      },
      [priority, ruleName],
    )

    const statusChange = useCallback(
      (newStatus) => {
        setStatus(newStatus);
        store.set("status", newStatus);
        if(ruleName.trim() === ''){
          setError("Please enter the pricing rule's name!");
          store.set("error", "Please enter the pricing rule's name!");
        }else{
          setError("");
          store.set("error", "");
        }
      },
      [status, ruleName],
    )

    return(
        <Card title="General Infomation" sectioned>
            <FormLayout>
              <TextField label="Name" value={ruleName} onChange={nameChange} error={error} autoComplete="off"/>
              <TextField label="Priority" type="number" value={priority} 
                         helpText="Please enter an integer from 0 to 99. 0 is the highest priority"
                         pattern={"[0-9]{1,2}"}
                         min={0}
                         max={99}
                         onChange={priorityChange}
                         error={errorPriority}/>
              <Select label="Status" 
                      options={[
                        {label: 'Enable', value: 'enable'},
                        {label: 'Disable', value: 'disable'}
                      ]}
                      onChange={statusChange}
                      value={status} />
            </FormLayout>
          </Card>
    );
}