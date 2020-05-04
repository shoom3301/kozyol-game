import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

export const FormContainer = styled.div`
    display: block;
    background: #f3f3f3;
    border: 1px solid #e1e1e1;
    padding: 20px;
`;

export const Box = styled.div<{ align?: string }>`
    margin-bottom: 15px;

    :last-child {
        margin-bottom: 0;
    }

    ${({ align }) => align === 'center' && css`
        text-align: center;
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

export const FormLink = styled(Link)`
  margin-left: 15px;
`;
