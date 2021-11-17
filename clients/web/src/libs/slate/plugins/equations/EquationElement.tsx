import React, { forwardRef } from 'react'

import KaTeX from 'katex'
import 'katex/dist/katex.min.css'

import { Box, chakra, Text } from '@chakra-ui/react'
import { EmptyElement } from '../utils/EmptyBlock'
import { EquationElement } from './nodeTypes'

export const Equation = forwardRef<HTMLDivElement, EquationElement>(
  ({ block, content, children, ...boxProps }, ref) => {
    const html = KaTeX.renderToString(content ?? '\\TeX', {
      throwOnError: false,
      displayMode: block
    })

    const Component = block ? Box : chakra.span
    if (content == null) content = ''

    return (
      <Component ref={ref} {...boxProps}>
        {content.length === 0 && block ? (
          <EmptyElement
            icon={
              <Component
                fontSize="sm"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            }
          >
            <Text color="gray.400" fontSize="sm" marginLeft="2">
              Add TeX equations.
            </Text>
          </EmptyElement>
        ) : (
          <Component
            contentEditable={false}
            cursor="pointer"
            padding={0.5}
            rounded="md"
            textAlign="center"
            overflow="auto"
            _hover={{ bgColor: 'gray.700' }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
        {children}
      </Component>
    )
  }
)
