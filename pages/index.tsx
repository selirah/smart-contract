import React from 'react'
import { CardGroup, Button } from 'semantic-ui-react'
import factory from 'web3/factory'
import Layout from 'components/Layout'
import Link from 'next/link'

interface Props {
  campaigns: string[]
}

const CampaignIndex: React.FC<Props> = (props) => {
  const { campaigns } = props

  const renderCampaigns = () => {
    const items = campaigns.map((address) => {
      return {
        header: address,
        description: <Link href={`/campaigns/${address}`}>View Campaign</Link>,
        fluid: true
      }
    })

    return <CardGroup items={items} />
  }

  return (
    <Layout>
      <div>
        <h3>Open Campaigns</h3>
        <Link href="/campaigns/new">
          <Button floated="right" content="Create Campaign" icon="add circle" primary />
        </Link>
        {renderCampaigns()}
      </div>
    </Layout>
  )
}

export const getServerSideProps = async () => {
  const campaigns: string[] = await factory.methods.getDeployedCampaigns().call()

  return {
    props: {
      campaigns: campaigns
    }
  }
}

export default CampaignIndex
