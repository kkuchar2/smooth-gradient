'use client';

import React from 'react';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow as style } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface SourceCodePreviewProps {
    sourceCode: string;
}

export const SourceCodePreview = (props: SourceCodePreviewProps) => {
    return <SyntaxHighlighter
        wrapLongLines={true}
        wrapLines={true}
        customStyle={{
            maxHeight: '100%',
            margin: 0,
            fontSize: '15px',
            background: '#21232b',
            borderRadius: '20px',
            padding: '30px',
            boxSizing: 'border-box',
        }}
        language={'javascript'} style={style}>
        {props.sourceCode}
    </SyntaxHighlighter>;
};