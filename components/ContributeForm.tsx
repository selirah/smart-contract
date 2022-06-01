import React, { useState, FormEvent } from 'react'
import { Form, Input, Message, Button } from 'semantic-ui-react'
import Campaign from 'web3/campaign'
import web3 from 'web3/web3'
import Router from 'next/router'

interface Props {
  address: string
}

const ContributeForm: React.FC<Props> = ({ address }) => {
  const [value, setValue] = useState('')
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
        .contribute()
        .send({ from: accounts[0], value: web3.utils.toWei(value, 'ether') })

      Router.replace(`/campaigns/${address}`)
    } catch (err: any) {
      setError(err.message)
    }
    setIsLoading(false)
    setValue('')
  }

  return (
    <Form onSubmit={onSubmit} error={!!error}>
      <Form.Field>
        <label>Amount to Contribute</label>
        <Input
          label="ether"
          labelPosition="right"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </Form.Field>
      <Message error header="Oops!" content={error} />
      <Button primary type="submit" loading={isLoading}>
        Contribute!
      </Button>
    </Form>
  )
}

export default ContributeForm
