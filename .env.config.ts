import dotenv from 'dotenv'

dotenv.config()

const ENV = {
  CAMPAIGN_FACTORY_ADDRESS: process.env.CAMPAIGN_FACTORY_ADDRESS,
  INFURA_RINKEBY_PROVIDER: process.env.INFURA_RINKEBY_PROVIDER,
  METAMASK_RECOVERY_PHRASE: process.env.METAMASK_RECOVERY_PHRASE
}

export default ENV
