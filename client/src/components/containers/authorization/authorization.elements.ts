import styled, { css } from 'styled-components';

export const AuthorizationContainer = styled.div`
  width: 500px;
  margin: 0 auto;
`;

export const FormContainer = styled.div`
    display: block;
    background: #f3f3f3;
    border: 1px solid #e1e1e1;
    padding: 20px;
`;

export const Box = styled.div<{error?: boolean}>`
    margin-bottom: 15px;

    :last-child {
        margin-bottom: 0;
    }

    ${({error}) => error && css`
        color: #d52315;
        font-size: 13px;
    `}
`;

export const Title = styled.h3`
    margin: 0;
`;

export const Label = styled.label`
    display: block;
    font-size: 14px;
    margin-bottom: 4px;
`;
