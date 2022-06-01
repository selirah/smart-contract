import React, { Fragment } from 'react'
import Layout from 'components/Layout'
import { GetServerSidePropsContext } from 'next'
import Campaign from 'web3/campaign'
import { CardGroup, Grid, Button } from 'semantic-ui-react'
import web3 from 'web3/web3'
import ContributeForm from 'components/ContributeForm'
import Link from 'next/link'

interface Props {
  minimumContribution: string
  balance: string
  requestsCount: string
  approversCount: string
  manager: string
  address: string
}

const CampaignShow: React.FC<Props> = (props) => {
  const { approversCount, balance, manager, minimumContribution, requestsCount, address } = props

  const renderCards = () => {
    const items = [
      {
        header: manager,
        meta: 'Address of Manager',
        description: 'The manager created this campaign and can create requests to withdraw money',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: minimumContribution,
        meta: 'Minimum Contribution (wei)',
        description: 'You must contribute at least this much wei to become an approver'
      },
      {
        header: requestsCount,
        meta: 'Number of Requests',
        description:
          'A request tries to withdraw money from the contract. Requests must be approved by approvers'
      },
      {
        header: approversCount,
        meta: 'Number of Approvers',
        description: 'Number of people who have already donated to this campaign'
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta: 'Campaign Balance (ether)',
        description: 'The balance is how much money this campaign has to spend'
      }
    ]

    return <CardGroup items={items} />
  }

  return (
    <Layout>
      <Fragment>
        <h3>Campaign Details</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{renderCards()}</Grid.Column>
            <Grid.Column width={6}>
              <ContributeForm address={address} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Link href={`/campaigns/${address}/requests`}>
                <Button primary>View Requests</Button>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Fragment>
    </Layout>
  )
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { address } = context.query
  const campaign = Campaign(address as string)

  const summary = await campaign.methods.getSummary().call()

  return {
    props: {
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
      address: address
    }
  }
}

export default CampaignShow
