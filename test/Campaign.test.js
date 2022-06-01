const assert = require('assert')
const ganache = require('ganache')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())

const compiledFactory = require('../ethereum/build/CampaignFactory.json')
const compiledCampaign = require('../ethereum/build/Campaign.json')

let accounts, factory, campaignAddress, campaign

beforeEach(async() => {
    accounts = await web3.eth.getAccounts()

    factory = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({
            data: compiledFactory.evm.bytecode.object
        })
        .send({ from: accounts[1], gas: '10000000' })

    await factory.methods
        .createCampaign('100')
        .send({ from: accounts[0], gas: '1000000' })

    const addresses = await factory.methods.getDeployedCampaigns().call()
    campaignAddress = addresses[0]

    // campaign has already been deployed when we deployed the campaign factory
    // so we use the campaign address returned
    campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress)
})

describe('Campaigns', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address)
        assert.ok(campaign.options.address)
    })

    it('marks caller as the campaign manager', async() => {
        const manager = await campaign.methods.manager().call()
        assert.equal(accounts[0], manager)
    })

    it('allows people to contribute money and marks them as approvers', async() => {
        await campaign.methods
            .contribute()
            .send({ value: '200', from: accounts[1] })

        const isContributor = await campaign.methods.approvers(accounts[1])
        assert(isContributor)
    })

    it('requires a minimum contribution', async() => {
        try {
            await campaign.methods
                .contribute()
                .send({ value: '5', from: accounts[1] })
            assert(false)
        } catch (err) {
            assert(err)
        }
    })

    it('allows a manager to make a payment request', async() => {
        await campaign.methods
            .createRequest('Buy batteries', '100', accounts[1]) // decription, value, recipient address
            .send({ from: accounts[0], gas: '1000000' }) // use manager's address

        const request = await campaign.methods.requests(0).call() // we are calling the first request made by the manager

        assert.equal('Buy batteries', request.description)
    })

    it('processes requests', async() => {
        await campaign.methods
            .contribute()
            .send({ value: web3.utils.toWei('10', 'ether'), from: accounts[0] })

        await campaign.methods
            .createRequest('Buy sensors', web3.utils.toWei('5', 'ether'), accounts[1])
            .send({ from: accounts[0], gas: '1000000' })

        await campaign.methods
            .approveRequest(0)
            .send({ from: accounts[0], gas: '1000000' }) // approve first request

        await campaign.methods
            .finalizeRequest(0)
            .send({ from: accounts[0], gas: '1000000' }) // finalize the first request NB: only manager can do this

        let balance = await web3.eth.getBalance(accounts[1])
        balance = web3.utils.fromWei(balance, 'ether')
        balance = parseFloat(balance)

        console.log(balance)

        assert(balance > 104)
    })
})