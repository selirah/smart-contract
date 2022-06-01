import React, { useState } from 'react'
import { Button, Table, Message } from 'semantic-ui-react'
import Link from 'next/link'
import Layout from 'components/Layout'
import { GetServerSidePropsContext } from 'next'
import Campaign from 'web3/campaign'
import RequestRow from 'components/RequestRow'
import { Request } from 'types'

interface Props {
  address: string
  requestCount: number
  requests: Request[]
  approversCount: number
}

const { Header, Row, HeaderCell, Body } = Table

const RequestIndex: React.FC<Props> = (props) => {
  const { address, requestCount, requests, approversCount } = props
  const [error, setError] = useState('')

  const renderRows = () => {
    return requests.map((request, index) => {
      return (
        <RequestRow
          request={request}
          key={index}
          address={address}
          id={index}
          approversCount={approversCount}
          setError={setError}
        />
      )
    })
  }

  return (
    <Layout>
      <h3>Requests</h3>
      <Link href={`/campaigns/${address}/requests/new`}>
        <Button primary floated="right" style={{ marginBottom: 10 }}>
          Add Request
        </Button>
      </Link>
      {!!error ? <Message error content={error} /> : null}
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>{renderRows()}</Body>
      </Table>
      <div>Found {requestCount} requests.</div>
    </Layout>
  )
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { address } = context.query
  const campaign = Campaign(address as string)
  const requestCount = await campaign.methods.getRequestsCount().call()
  const approversCount = await campaign.methods.approversCount().call()

  const requests = await Promise.all(
    Array(parseInt(requestCount))
      .fill(null)
      .map((_, index) => {
        return campaign.methods.requests(index).call()
      })
  )

  return {
    props: {
      address: address,
      requests: JSON.parse(JSON.stringify(requests)),
      requestCount: parseInt(requestCount),
      approversCount: parseInt(approversCount)
    }
  }
}

export default RequestIndex
