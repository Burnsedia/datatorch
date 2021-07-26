import React from 'react'
import { NextPage } from 'next'
import { LayoutNavbar } from '@/common/layouts/LayoutNavbar'
import { AppNavbar } from '@/common/navbar/AppNavbar'
import Image from 'next/image'

const Index: NextPage = () => {
  return (
    <LayoutNavbar navbar={<AppNavbar />}>
      <Image
        src="/social-card.png"
        width="600"
        height="315"
        alt="social card"
        layout="fixed"
      />
    </LayoutNavbar>
  )
}

export default Index
