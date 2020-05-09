import React from 'react'
import styled from 'styled-components'

export const GameListItem = styled.li`
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #e1e1e1;
    color: #000;
    display: block;
    text-decoration: none;
    background: #fff;
    cursor: pointer;
`

export const GameAuthor = styled.span`
    margin-bottom: 5px;
    margin-right: 5px;
    font-size: 16px;
    font-weight: bold;
`

export const GameSlots = styled.span`
    font-size: 14px;
`

export const GameListContainer = styled.ul`
    margin: 0;
    padding: 0;
    max-height: 400px;
    overflow-y: scroll;
`
