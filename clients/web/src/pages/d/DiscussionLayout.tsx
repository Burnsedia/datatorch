import React from 'react'
import { BoxProps } from '@chakra-ui/react'
import { LayoutNavbarSidebar } from '@/common/layouts/LayoutNavbarSidebar'
import { AppNavbar } from '@/common/navbar/AppNavbar'
import { useScrollBarTheme } from '@/libs/hooks/useScrollbarTheme'

export const DiscussionLayout: React.FC<BoxProps> = ({ children }) => {
  const scrollCss = useScrollBarTheme()
  return (
    <LayoutNavbarSidebar
      navbar={AppNavbar}
      contentContainer={{ css: scrollCss }}
    >
      {children}
    </LayoutNavbarSidebar>
  )
}
