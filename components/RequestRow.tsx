import React, { useState } from 'react'
import { Request } from 'types'
import { Table, Button } from 'semantic-ui-react'
import web3 from 'web3/web3'
import Campaign from 'web3/campaign'
import Router from 'next/router'

interface Props {
  request: Request
  address: string
  id: number
  approversCount: number
  setError: (value: string) => void
}

const { Row, Cell } = Table

const RequestRow: React.FC<Props> = (props) => {
  const { request, address, id, approversCount, setError } = props
  const [isApproving, setIsApproving] = useState(false)
  const [isFinalizing, setIsFinalizing] = useState(false)
  const readyToFinalize = parseInt(request.approvalCount) > approversCount / 2

  const onApproveRequest = async () => {
    const campaign = Campaign(address)
    setIsApproving(true)
    setError('')
    try {
      const accounts = await web3.eth.getAccounts()
      await campaign.methods.approveRequest(id).send({ from: accounts[0] })
      Router.replace(`/campaigns/${address}/requests`)
    } catch (err: any) {
      setError(err.message)
    }
    setIsApproving(false)
  }

  const onFinalizeRequest = async () => {
    const campaign = Campaign(address)
    setIsFinalizing(true)
    setError('')
    try {
      const accounts = await web3.eth.getAccounts()
      await campaign.methods.finalizeRequest(id).send({ from: accounts[0] })
      Router.replace(`/campaigns/${address}/requests`)
    } catch (err: any) {
      setError(err.message)
    }
    setIsFinalizing(false)
  }

  return (
    <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
      <Cell>{id}</Cell>
      <Cell>{request.description}</Cell>
      <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
      <Cell>{request.recipient}</Cell>
      <Cell>{`${request.approvalCount}/${approversCount}`}</Cell>
      <Cell>
        {request.complete ? null : (
          <Button color="green" basic onClick={onApproveRequest} loading={isApproving}>
            Approve
          </Button>
        )}
      </Cell>
      <Cell>
        {request.complete ? null : (
          <Button color="teal" basic onClick={onFinalizeRequest} loading={isFinalizing}>
            Finalize
          </Button>
        )}
      </Cell>
    </Row>
  )
}

export default RequestRow
