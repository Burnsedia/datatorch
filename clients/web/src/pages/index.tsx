import React from 'react'
import { NextPage } from 'next'
import { LayoutNavbar } from '@/common/layouts/LayoutNavbar'
import { AppNavbar } from '@/common/navbar/AppNavbar'

const Index: NextPage = () => {
  return <LayoutNavbar navbar={<AppNavbar />}></LayoutNavbar>
}

export default Index
