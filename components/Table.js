import React from 'react';
import { Card, DataTable, TextContainer, Heading } from "@shopify/polaris";
import store from 'store-js';

export default function Table({productType, priceType, applyPrice, decreaseAmount, decreasePercentage, selectedSpecificProducts, selectedCollections, selectedProductTags, ruleName}){
  let price = "";
  if(priceType === "apply_price"){
    price = (applyPrice.trim() === "") ? "" : applyPrice +'đ';
  }else if (priceType === "decrease_amount"){
    price = (decreaseAmount === "") ? "" : 'all variant prices -' + decreaseAmount +'đ';
  }else{
    price = (decreasePercentage === "") ? "" :'all variant prices -' + decreasePercentage + '%';
  }

  let specificProducts = [];
  selectedSpecificProducts.map((option)=>{
    let product = store.get(option);
    let specificProduct = [];
    specificProduct.push(product.title);
    specificProduct.push(price);
    specificProducts.push(specificProduct);
  });

  let productCollections = [];
  selectedCollections.map((option)=>{
    let collection = store.get(option);
    let productCollection = [];
    productCollection.push(collection.title);
    productCollection.push(price);
    productCollections.push(productCollection);
  })

  let productTags = [];
  selectedProductTags.map((option)=>{
    let tag = store.get(option);
    let productTag = [];
    productTag.push(tag.title);
    productTag.push(price);
    productTags.push(productTag);
  })
  
  if((ruleName.trim() === "")){
    return(
      <Card title="Show product pricing details" sectioned>
      </Card>
    );
  }else{
    return(
      <Card title="Show product pricing details" sectioned>
        {(productType === "all_products") && <DataTable 
            columnContentTypes={[
              'text',
              'text',
            ]}
            headings={[
              'Title',
              'Modified Price',
            ]}
            rows={[['All products', price]]}
        />}
        {(productType === "specific_products") && <DataTable 
            columnContentTypes={[
              'text',
              'text',
            ]}
            headings={[
              'Title',
              'Modified Price',
            ]}
            rows={specificProducts}
        />}
        {(productType === "product_collections") && <DataTable 
            columnContentTypes={[
              'text',
              'text',
            ]}
            headings={[
              'Title',
              'Modified Price',
            ]}
            rows={productCollections}
        />}
        {(productType === "product_tags") && <DataTable 
            columnContentTypes={[
              'text',
              'text',
            ]}
            headings={[
              'Title',
              'Modified Price',
            ]}
            rows={productTags}
        />}
      </Card>
    );
  }
  
}