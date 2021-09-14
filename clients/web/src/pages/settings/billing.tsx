import { SettingsLayout } from '@/applets/settings/SettingsLayout'
import { Card, CardHeading } from '@/common/Card'
import { HStack, Stat, StatHelpText, StatLabel, StatNumber, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { NextPage } from 'next'
import React, { useState } from 'react'

interface BillingHistoryItem {
  id: string
  invoiceDate: string
  type: string
  billingPeriod: string
  amount: string
  status: string
}

type BillingHistoryProps = Omit<BillingHistoryItem, 'id'>

interface BillStatProps {
  cost: string
  date: string
}

const testData: BillingHistoryItem[] = [
  {
    id: '12345',
    invoiceDate: '06/08/2021',
    type: 'Professional',
    billingPeriod: '06/10/2021 – 07/08/2021',
    amount: '$10.00',
    status: 'Processed'
  },
  {
    id: '23456',
    invoiceDate: '06/02/2021',
    type: 'Professional',
    billingPeriod: '06/02/2021 – 06/02/22',
    amount: '$10.00',
    status: 'Pending'
  },
  {
    id: '34567',
    invoiceDate: '05/05/2021',
    type: 'Professional',
    billingPeriod: '06/06/21 – 12/12/12',
    amount: '$10.00',
    status: 'Unpaid'
  }
]

const testMonthlyStats = {
  cost: '$10.00',
  date: '06/10/2021 – 07/08/2021'
}

const testNextStats = {
  cost: '$10.00',
  date: '06/10/2021 – 07/08/2021'
}

const CurrentMonthlyBillStat: React.FC<BillStatProps> = ({ cost, date }) => {
  return (
    <Stat>
      <StatLabel>"Monthly Costs"</StatLabel>
      <StatNumber>{cost}</StatNumber>
      {date && <StatHelpText>{date}</StatHelpText>}
    </Stat>
  )
  }

const NextMonthlyBillStat: React.FC<BillStatProps> = ({ cost, date }) => {
  return (
    <Stat>
      <StatLabel>"Next Month's Costs'"</StatLabel>
      <StatNumber>{cost}</StatNumber>
      {date && <StatHelpText>{date}</StatHelpText>}
    </Stat>
  )
}

const BillingInfoCard: React.FC = () => {
  const [monthlyCosts] = useState(testMonthlyStats)
  const [nextCosts] = useState(testNextStats)
  return (
    <Card>
      <CardHeading>Billing Info</CardHeading>
      <HStack>
        <CurrentMonthlyBillStat {...monthlyCosts} />
        <NextMonthlyBillStat {...nextCosts} />
      </HStack>
    </Card>
  )
}

const BillingHistoryRow: React.FC<BillingHistoryProps> = ({
  invoiceDate,
  type,
  billingPeriod,
  amount,
  status
}) => {
  const dataArray = [invoiceDate, type, billingPeriod, amount, status]
  return (<Tr>
    {dataArray.map((d, i) => (
      <Td key={i}>{d}</Td>
    ))}
  </Tr>)
}

const BillingHistoryCard: React.FC = () => {
  const [billingHistory] = useState(testData)
  const headers = ['Invoice Date', 'Type', 'Billing Period', 'Amount', 'Status']
  return (
    <Card>
      <CardHeading>Billing History</CardHeading>
      <Table>
        <Thead>
          <Tr>
            {headers.map((d, i) => (
              <Th key={i}>{d}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {billingHistory.map(({ id, ...rest }) => {
            return <BillingHistoryRow key={id} {...rest} />
          })}
        </Tbody>
      </Table>
    </Card>
  )
}

const SettingsBilling: NextPage = () => {
  return (
    <SettingsLayout>
      <BillingInfoCard />
      <BillingHistoryCard />
    </SettingsLayout>
  )
}

export default SettingsBilling
