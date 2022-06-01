import React, { useState, FormEvent } from 'react'
import Layout from 'components/Layout'
import { Form, Button, Message, Input } from 'semantic-ui-react'
import Campaign from 'web3/campaign'
import web3 from 'web3/web3'
import Router from 'next/router'
import Link from 'next/link'
import { GetServerSidePropsContext } from 'next'

interface Props {
  address: string
}

const RequestNew: React.FC<Props> = ({ address }) => {
  const [description, setDescription] = useState('')
  const [value, setValue] = useState('')
  const [recipient, setRecipient] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    const campaign = Campaign(address)
    try {
      const accounts = await web3.eth.getAccounts()
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
        .send({ from: accounts[0] })

      Router.push(`/campaigns/${address}/requests`)
    } catch (err: any) {
      setError(err.message)
    }
    setIsLoading(false)
  }

  return (
    <Layout>
      <Link href={`/campaigns/${address}/requests`}>&laquo; Back</Link>
      <h3>Create a Request</h3>
      <Form onSubmit={onSubmit} error={!!error}>
        <Form.Field>
          <label>Description</label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} />
        </Form.Field>
        <Form.Field>
          <label>Value in Ether</label>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            label="ether"
            labelPosition="right"
          />
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} />
        </Form.Field>
        <Message error header="Oops!" content={error} />
        <Button primary type="submit" loading={isLoading}>
          Create!
        </Button>
      </Form>
    </Layout>
  )
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { address } = context.query
  return {
    props: {
      address: address
    }
  }
}

export default RequestNew
