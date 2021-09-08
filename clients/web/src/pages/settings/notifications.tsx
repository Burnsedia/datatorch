import React from 'react'
import { NextPage } from 'next'
import { Card, CardHeading } from '@/common/Card'
import { SettingsLayout } from '@/applets/settings/SettingsLayout'

const NotificationsCard: React.FC = () => {
  return (
    <Card>
      <CardHeading>Notification Settings</CardHeading>
    </Card>
  )
}

const SettingsNotifications: NextPage = () => {
  return (
    <SettingsLayout>
      <NotificationsCard />
    </SettingsLayout>
  )
}

export default SettingsNotifications
