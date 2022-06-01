import web3 from './web3'
import Campaign from 'ethereum/build/Campaign.json'

const campaign = (address: string) => {
  return new web3.eth.Contract(Campaign.abi as any, address)
}

export default campaign
