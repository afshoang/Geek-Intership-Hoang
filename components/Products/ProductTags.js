import React, { useState, useCallback } from 'react';
import {Stack, Autocomplete, TextContainer, Tag, Spinner} from "@shopify/polaris";
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import store from 'store-js';

const GET_TAGS = gql`
query Tag{
    shop{
        productTags(first: 250 ){
            edges{
                cursor
                node
                }
            }
        }
    }
`;

export default function ProductTags({tagField, setTagField, tagOptions, setTagOptions, setSelectedProductTags}){
    const deselectedOptions = [];
    const [selectedOptions, setSelectedOptions] = useState((store.get("tags") === undefined)?[]:store.get("tags"));
    const [inputValue, setInputValue] = useState(tagField);
    const [options, setOptions] = useState((tagField.length>0)?tagOptions:deselectedOptions);

    const updateText = useCallback(
    (value) => {
        setInputValue(value);
        setTagField(value);

        if (value === '') {
        setOptions(deselectedOptions);
        setTagOptions(deselectedOptions);
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
        setTagOptions(resultOptions);
    },
    [deselectedOptions],
    );

    const removeTag = useCallback(
    (tag) => () => {
        const options = [...selectedOptions];
        options.splice(options.indexOf(tag), 1);
        store.set("tags", options)
        setSelectedOptions(options);
        setSelectedProductTags(options);
    },
    [selectedOptions],
    );

    const tagsMarkup = selectedOptions.map((option) => {
        let tag = store.get(option);
        return (
            <Tag key={`option${tag.title}`} onRemove={removeTag(option)}>
                {tag.title}
            </Tag>
        );
    });

    const updateSelection = useCallback(
        (selected) => {
          setSelectedOptions(selected);
          setSelectedProductTags(selected);
          store.set("tags", selected);
        },
        [],
    );

    const textField = (
    <Autocomplete.TextField
        onChange={updateText}
        label="Tags"
        labelHidden
        value={inputValue}
        placeholder="Vintage, cotton, summer"
        autoComplete="off"
    />
    );

    return (
        <Query query={GET_TAGS}>
            {({data, loading, error})=>{
                if(loading) return (
                    <Spinner accessibilityLabel="Spinner" size="small" />
                )
                if(error) return <div>{error.message}</div>
                data.shop.productTags.edges.forEach((tag)=>{
                    deselectedOptions.push({
                        label: tag.node,
                        value: tag.node,
                        cursor: tag.cursor
                    })
                    store.set(tag.node,{
                        title: tag.node,
                        cursor: tag.cursor
                    })
                })
                return (
                    <div>
                        <Autocomplete
                        allowMultiple
                        options={options}
                        selected={selectedOptions}
                        textField={textField}
                        onSelect={updateSelection}
                        listTitle="SUGGESTED TAGS"
                        />
                        <br />
                        <TextContainer>
                        <Stack>{tagsMarkup}</Stack>
                        </TextContainer>
                    </div>
                )
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
