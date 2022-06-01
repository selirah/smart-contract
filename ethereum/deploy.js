const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')
const compiledFactory = require('../ethereum/build/CampaignFactory.json')

const provider = new HDWalletProvider(
    'smile world oval arm project business rubber assist video program script boring',
    'https://rinkeby.infura.io/v3/769b4a530058454e881f0bab0b01740b'
)

const web3 = new Web3(provider)

const deploy = async() => {
    const accounts = await web3.eth.getAccounts()

    console.log('Attempting to deploy from account', accounts[0])

    const result = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: compiledFactory.evm.bytecode.object })
        .send({ gas: '10000000', from: accounts[0] })

    console.log('Contract deployed to', result.options.address)
    provider.engine.stop()
}
deploy()