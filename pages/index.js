import React, { useState } from 'react';
import { Layout, Page,} from "@shopify/polaris";
import Infomation from '../components/Infomation';
import Products from '../components/Products/Products';
import Price from '../components/Price/Price';
import Table from '../components/Table';
import store from 'store-js';

const Index = () => {
  const [ruleName, setRuleName] = useState((store.get("name") === undefined) ? '':store.get("name"));
  const [error, setError] = useState((store.get("error") === undefined) ? '':store.get("error"));
  const [productType, setProductType] = useState('all_products');
  const [priceType, setPriceType] = useState('apply_price');
  const [selectedSpecificProducts, setSelectedSpecificProducts] = useState((store.get("products") === undefined)?[]:store.get("products"));
  const [selectedCollections, setSelectedCollections] = useState((store.get("collections") === undefined)?[]:store.get("collections"));
  const [selectedProductTags, setSelectedProductTags] = useState((store.get("tags") === undefined)?[]:store.get("tags"));
  const [applyPrice, setApplyPrice] = useState((store.get("apply price") === undefined) ? '':store.get("apply price"));
  const [decreaseAmount, setDecreaseAmount] = useState((store.get("decrease amount") === undefined) ? '':store.get("decrease amount"));
  const [decreasePercentage, setDecreasePercentage] = useState((store.get("decrease percentage") === undefined) ? '':store.get("decrease percentage"));

  return(
    <Page>
      <Layout>
        <Layout.Section>
          <Infomation ruleName={ruleName} setRuleName={(e)=>setRuleName(e)} error={error} setError={(e)=>setError(e)}/>
          <Products productType={productType} setProductType={(e)=>setProductType(e)}
                    setSelectedSpecificProducts={(e)=>setSelectedSpecificProducts(e)}
                    setSelectedCollections={(e)=>setSelectedCollections(e)}
                    setSelectedProductTags={(e)=>setSelectedProductTags(e)}
                    ruleName={ruleName} setError={(e)=>setError(e)} />
          <Price priceType={priceType} setPriceType={(e)=>setPriceType(e)} 
                 setApplyPrice={(e)=>setApplyPrice(e)}
                 setDecreaseAmount={(e)=>setDecreaseAmount(e)}
                 setDecreasePercentage={(e)=>setDecreasePercentage(e)}
                 ruleName={ruleName} setError={(e)=>setError(e)} />
        </Layout.Section>
        
        <Layout.Section secondary>
          <Table productType={productType} priceType={priceType} ruleName={ruleName}
                 applyPrice={applyPrice} decreaseAmount={decreaseAmount} decreasePercentage={decreasePercentage} 
                 selectedSpecificProducts={selectedSpecificProducts} selectedCollections={selectedCollections}
                 selectedProductTags={selectedProductTags}
                 />
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Index;