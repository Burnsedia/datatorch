import React from 'react'
import { cookieChecker, redirectToLogin } from '@/libs/utils/cookies'
import { GetServerSidePropsContext, NextPage } from 'next'
import { IndexProps } from '@/pages/home'
import { DiscussionLayout } from './DiscussionLayout'

const DiscussionPage: NextPage<IndexProps> = ({ user }) => {
  return (
    <DiscussionLayout {...user}> You shouldn&apos;t be here </DiscussionLayout>
  )
}

export default DiscussionPage

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await cookieChecker(context, false)
  if (!user) return redirectToLogin(context.res)
  return {
    props: { user }
  }
}
