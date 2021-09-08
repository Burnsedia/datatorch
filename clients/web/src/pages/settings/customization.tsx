import { SettingsLayout } from '@/applets/settings/SettingsLayout'
import { Card, CardHeading } from '@/common/Card'
import { FormToggle } from '@/common/forms/FormField'
import { NextPage } from 'next'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

interface DarkModeInputs {
  darkMode: boolean
  isSubmitting?: boolean
}

const DarkModeCard: React.FC = () => {
  const {
    register,
    handleSubmit,

    formState: { isSubmitting }
  } = useForm<DarkModeInputs>({ mode: 'onChange' })

  const onSubmit = handleSubmit((data, event) => console.log(data, event))
    

  return (
    <Card>
      <CardHeading>Dark Mode</CardHeading>
      <form onChange={handleSubmit(onSubmit)}>
        <FormToggle
          displayName="Enable dark mode?"
          field="darkMode"
          isSubmitting={isSubmitting}
          register={register}
        />
      </form>
    </Card>
  )
}

const SettingsCustomization: NextPage = () => {
  return (
    <SettingsLayout>
      <DarkModeCard />
    </SettingsLayout>
  )
}

export default SettingsCustomization
