import web3 from './web3'
import CampaignFactory from 'ethereum/build/CampaignFactory.json'

const instance = new web3.eth.Contract(
  CampaignFactory.abi as any,
  '0x40BB9b158a41B000232Db962e96FB25bb65BBe74'
)

export default instance
