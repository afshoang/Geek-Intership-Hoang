import React, { useState, useCallback } from 'react';
import {Card, TextStyle, Autocomplete, Tag, Spinner, Modal, Button, TextField, ResourceList, ResourceItem, TextContainer, Stack, Thumbnail} from "@shopify/polaris";
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import store from 'store-js';

const GET_PRODUCTS = gql`
query Products{
    products(first: 50) {
        edges {
          node {
            id
            title
            featuredImage {
                originalSrc
            }
          }
        }
    }
}
`;

export default function SpecificProducts({setSelectedSpecificProducts}){
    const deselectedOptions = [];
    const [inputValue, setInputValue] = useState("");
    const [selectedOptions, setSelectedOptions] = useState((store.get("products") === undefined)?[]:store.get("products"));
    const [active, setActive] = useState(false);
    const [options, setOptions] = useState(deselectedOptions);
    const resourceName = {
        singular: 'product',
        plural: 'products',
    };

    const handleChange = useCallback(() => setActive(false), [active]);

    const updateText = useCallback(
        (value) => {
            setInputValue(value);
            setActive(true);
    
            if (value.trim() === '') {
            setOptions(deselectedOptions);
            return;
            }
    
            const filterRegex = new RegExp(value, 'i');
            const resultOptions = deselectedOptions.filter((option) =>
            option.title.match(filterRegex),
            );
            let endIndex = resultOptions.length - 1;
            if (resultOptions.length === 0) {
            endIndex = 0;
            }
            setOptions(resultOptions);
        },
    [deselectedOptions],
    );
    
    const removeTag = useCallback(
    (tag) => () => {
        const options = [...selectedOptions];
        options.splice(options.indexOf(tag), 1);
        store.set("products", options)
        setSelectedOptions(options);
        setSelectedSpecificProducts(options);
    },
    [selectedOptions],
    );

    const tagsMarkup = selectedOptions.map((option) => {
        let product = store.get(option);
        return (
            <Tag key={`option${product.title}`} onRemove={removeTag(option)}>
                {product.title}
            </Tag>
        );
    });

    const updateSelection = useCallback(
        (selected) => {
            setSelectedOptions(selected);
            setSelectedSpecificProducts(selected);
            store.set("products", selected);
        },
        [],
    );

    const textField = (
    <Autocomplete.TextField
        onChange={updateText}
        label="Products"
        labelHidden
        value={inputValue}
        placeholder="Vintage, cotton, summer"
        autoComplete="off"
    />
    );

    const activator = (
        <TextField
                onChange={updateText}
                label="Products"
                labelHidden
                placeholder="Search products"
                autoComplete="off"
                connectedRight={<Button onClick={()=>setActive(true)}>Browse</Button>}
        />
    )

    function titleCase(string) {
        return string
            .toLowerCase()
            .split(' ')
            .map((word) => word.replace(word[0], word[0].toUpperCase()))
            .join('');
    }

    function renderItem(item) {
        const {id, title, image} = item;
        const media = <Thumbnail
            source= {image}
            size="large"
            alt={title}
        />;
        return (
          <ResourceItem
            id={id}
            media={media}
          >
          <TextStyle variation="strong">{title}</TextStyle>  
          </ResourceItem>
        );
    }

    return (
        <Query query={GET_PRODUCTS}>
            {({data, loading, error})=>{
                if(loading) return (
                    <Spinner accessibilityLabel="Spinner" size="small" />
                )
                if(error) return <div>{error.message}</div>
                data.products.edges.forEach((product)=>{
                    deselectedOptions.push({
                        id: product.node.id,
                        title: product.node.title,
                        image: product.node.featuredImage.originalSrc
                    })
                    store.set(product.node.id, {
                        title: product.node.title,
                        id: product.node.id,
                        image: product.node.featuredImage.originalSrc
                    })
                })

                return(
                    <>
                        <Modal
                            activator={activator}
                            open={active}
                            onClose={handleChange}
                            title="SELECT SPECIFIC PRODUCTS"
                            primaryAction={{
                            content: 'Select',
                            onAction: handleChange,
                            }}
                        >
                            <Modal.Section>
                            <Card>
                                {textField}
                                <ResourceList
                                    resourceName={resourceName}
                                    items={options}
                                    renderItem={renderItem}
                                    selectedItems={selectedOptions}
                                    onSelectionChange={updateSelection}
                                    selectable
                                /> 
                            </Card>    
                            </Modal.Section>
                        </Modal>
                        <br />
                        <TextContainer>
                            <Stack vertical>{tagsMarkup}</Stack>
                        </TextContainer>
                    </>
                )
            }}
        </Query>    
    );
}