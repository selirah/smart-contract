import React, { FormEvent, useState, Fragment } from 'react'
import { Form, Button, Input, Message } from 'semantic-ui-react'
import Layout from 'components/Layout'
import factory from 'web3/factory'
import web3 from 'web3/web3'
import Router from 'next/router'

const CampaignNew = () => {
  const [minContribution, setMinContribution] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const accounts = await web3.eth.getAccounts()
      await factory.methods.createCampaign(minContribution).send({ from: accounts[0] })

      Router.push('/')
    } catch (err: any) {
      setError(err.message)
    }
    setIsLoading(false)
  }

  return (
    <Layout>
      <Fragment>
        <h3>Create a Campaign</h3>
        <Form onSubmit={onSubmit} error={!!error}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              label="wei"
              labelPosition="right"
              value={minContribution}
              onChange={(e) => setMinContribution(e.target.value)}
            />
          </Form.Field>
          <Message error header="Oops!" content={error} />
          <Button primary type="submit" loading={isLoading}>
            Create!
          </Button>
        </Form>
      </Fragment>
    </Layout>
  )
}

export default CampaignNew
