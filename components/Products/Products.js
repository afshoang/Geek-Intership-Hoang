import React, { useState, useCallback } from 'react';
import { Card, Stack, RadioButton, FormLayout} from "@shopify/polaris";
import ProductTags from './ProductTags';
import ProductCollections from './ProductCollections';
import SpecificProducts from './SpecificProducts';
import store from "store-js";

export default function Products({productType, setProductType, setSelectedSpecificProducts, setSelectedCollections, setSelectedProductTags, ruleName, setError}){
    const [value, setValue] = useState(productType);
    const [collectionField, setCollectionField] = useState('');
    const [collectionOptions, setCollectionOptions] = useState([]);
    const [tagField, setTagField] = useState('');
    const [tagOptions, setTagOptions] = useState([]);

    const handleChange = useCallback(
        (_checked, newValue) => {
            setValue(newValue)
            setProductType(newValue)

            if(ruleName.trim() === ""){
                setError("Please enter the pricing rule's name!")
                store.set("error", "Please enter the pricing rule's name!")
            }else{
                setError("")
                store.set("error", "")
            }
        },[ruleName],);

    return(
        <Card title="Apply to Products" sectioned>
            <FormLayout>
                <Stack vertical>
                    <RadioButton
                    label="All products"
                    checked={value === 'all_products'}
                    id="all_products"
                    name="products"
                    onChange={handleChange}
                    />

                    <RadioButton
                    label="Specific products"
                    id="specific_products"
                    name="products"
                    checked={value === 'specific_products'}
                    onChange={handleChange}
                    />
                    {value === "specific_products" && <SpecificProducts setSelectedSpecificProducts={(e)=>setSelectedSpecificProducts(e)}/>}

                    <RadioButton
                    label="Product collections"
                    id="product_collections"
                    name="products"
                    checked={value === 'product_collections'}
                    onChange={handleChange}
                    />
                    {value === "product_collections" && <ProductCollections collectionField={collectionField} setCollectionField={(e)=>setCollectionField(e)}
                    collectionOptions={collectionOptions}  setCollectionOptions={(e)=>setCollectionOptions(e)}
                    setSelectedCollections={(e)=>setSelectedCollections(e)} />}
                    
                    <RadioButton
                    label="Product Tags"
                    id="product_tags"
                    name="products"
                    checked={value === 'product_tags'}
                    onChange={handleChange}
                    />
                    {value === "product_tags" && <ProductTags tagField={tagField} setTagField={(e)=>setTagField(e)} 
                    tagOptions={tagOptions} setTagOptions={(e)=>setTagOptions(e)}
                    setSelectedProductTags={(e)=>setSelectedProductTags(e)} />}

                </Stack>
            </FormLayout>
        </Card>
    );
}