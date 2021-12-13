import React, { useState, useCallback } from 'react';
import {Stack, Autocomplete, TextContainer, Tag, Spinner, ResourceItem, Thumbnail, Button, Icon, Subheading} from "@shopify/polaris";
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import store from 'store-js';

const GET_COLLECTIONS = gql`
query Collection{ 
    collections(first:100) {
      edges {
        node {
           id,
           handle,
           title,
           description,
           productsCount
        }
      }
    }  
  }
`;

export default function ProductCollections({collectionField, setCollectionField, collectionOptions, setCollectionOptions, setSelectedCollections}){
    const deselectedOptions = [];
    const [selectedOptions, setSelectedOptions] = useState((store.get("collections") === undefined)?[]:store.get("collections"));
    const [inputValue, setInputValue] = useState(collectionField);
    const [options, setOptions] = useState((collectionField.length>0)?collectionOptions:deselectedOptions);

    const updateText = useCallback(
    (value) => {
        setInputValue(value);
        setCollectionField(value);

        if (value === '') {
        setOptions(deselectedOptions);
        setCollectionOptions(deselectedOptions);
        return;
        }

        const filterRegex = new RegExp(value, 'i');
        const resultOptions = deselectedOptions.filter((option) =>
        option.label.match(filterRegex),
        );
        let endIndex = resultOptions.length - 1;
        if (resultOptions.length === 0) {
        endIndex = 0;
        }
        setOptions(resultOptions);
        setCollectionOptions(resultOptions);
    },
    [deselectedOptions],
    );

    const removeTag =
    (tag) => () => {
        const options = [...selectedOptions];
        options.splice(options.indexOf(tag), 1);
        store.set("collections", options);
        setSelectedOptions(options);
        setSelectedCollections(options);
    }

    const tagsMarkup = selectedOptions.map((option) => {
        let collection = store.get(option);
        return (
            <Tag key={`option${collection.title}`} onRemove={removeTag(option)}>
                 {collection.title}
            </Tag>
        );
    });

    const updateSelection = useCallback(
        (selected) => {
          setSelectedOptions(selected);
          setSelectedCollections(selected);
          store.set("collections", selected);
        },
        [],
    );

    const textField = (
    <Autocomplete.TextField
        onChange={updateText}
        label="Collections"
        labelHidden
        value={inputValue}
        placeholder="Vintage, cotton, summer"
        autoComplete="off"
    />
    );

    return (
        <Query query={GET_COLLECTIONS}>
            {({data, loading, error})=>{
                if(loading) return (
                    <Spinner accessibilityLabel="Spinner" size="small" />
                )
                if(error) return <div>{error.message}</div>
                data.collections.edges.forEach((collection)=> {
                    deselectedOptions.push({
                        value: collection.node.id,
                        label: collection.node.title,
                        id: collection.node.id,
                    })
                    store.set(collection.node.id, {
                        title: collection.node.title,
                        id: collection.node.id,
                    })
                })

                return(
                    <div>
                        <Autocomplete
                        allowMultiple
                        options={options}
                        selected={selectedOptions}
                        textField={textField}
                        onSelect={updateSelection}
                        listTitle="SUGGESTED COLLECTIONS"
                        />
                        <br/>
                        <TextContainer>
                        <Stack vertical>{tagsMarkup}</Stack>
                        </TextContainer>
                    </div>
                );
            }}
        </Query>
    );

    function titleCase(string) {
    return string
        .toLowerCase()
        .split(' ')
        .map((word) => word.replace(word[0], word[0].toUpperCase()))
        .join('');
    }
}