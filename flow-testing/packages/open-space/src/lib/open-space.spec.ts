import { emulator, FlowAccount } from '@flow-testing/flow-testing-utils'
import * as transactions from './transactions'
import { deployContracts } from './contracts'
import * as scripts from './scripts'

const createAdmin = async () => {
  return await deployContracts(
    await (
      await (
        await (await new FlowAccount().create()).fundWithFlow(1000)
      ).setupFUSDVault()
    ).fundWithFUSD(1000)
  )
}

const createUser = async () => {
  return await (await new FlowAccount().create()).fundWithFlow(1000)
}

describe('OpenSpaceItems', () => {
  beforeAll(async () => {
    await emulator.connect()
  })

  describe('Basic', () => {
    let admin: FlowAccount

    beforeAll(async () => {
      admin = await createAdmin()
      await transactions.setupOpenSpaceAccount(admin, admin)
    })

    it('can install an OpenSpace NFT collection, an OpenSpaceVoucher collection, and FUSD vault', async () => {
      const alice = await createUser()
      await expect(
        transactions.setupOpenSpaceAccount(admin, alice)
      ).resolves.toBeTruthy()
      await expect(alice.hasFUSDVault()).resolves.toEqual(true)
      await expect(
        scripts.hasOpenSpaceCollection(admin, alice)
      ).resolves.toEqual(true)
      await expect(
        scripts.hasOpenSpaceVoucherCollection(admin, alice)
      ).resolves.toEqual(true)
      await expect(
        scripts.hasOpenSpaceAdminNFTStorefront(admin, alice)
      ).resolves.toEqual(false)
    })
  })

  describe('OpenSpaceItems', () => {
    it('can mint OpenSpaceItems', async () => {
      const admin = await createAdmin()
      await expect(
        transactions.setupOpenSpaceAccount(admin, admin)
      ).resolves.toBeTruthy()
      await expect(
        scripts.getOpenSpaceCollectionLen(admin, admin)
      ).resolves.toEqual(0)
      await expect(
        transactions.mintOpenSpaceItem(admin, admin, [{}])
      ).resolves.toBeTruthy()
      await expect(
        scripts.getOpenSpaceCollectionLen(admin, admin)
      ).resolves.toEqual(1)
    })
  })

  describe('OpenSpaceVoucher', () => {
    let admin: FlowAccount
    beforeAll(async () => {
      admin = await createAdmin()
      await transactions.setupOpenSpaceAccount(admin, admin)
    })
    it('can mint vouchers to an account', async () => {
      const alice = await createUser()
      await expect(
        transactions.setupOpenSpaceAccount(admin, alice)
      ).resolves.toBeTruthy()
      await expect(
        scripts.getOpenSpaceVoucherCollectionLen(admin, alice)
      ).resolves.toEqual(0)
      await expect(
        transactions.mintOpenSpaceVouchers(admin, alice, [{}])
      ).resolves.toBeTruthy()
      await expect(
        scripts.getOpenSpaceVoucherCollectionLen(admin, alice)
      ).resolves.toEqual(1)
    })
  })

  describe('OpenSpaceAdminNFTStorefront', () => {
    it('consumes a voucher when a listing is bought', async () => {
      const admin = await createAdmin()
      const alice = await createUser()
      const setId = '0'
      await expect(
        transactions.setupOpenSpaceAccount(admin, alice)
      ).resolves.toBeTruthy()
      await expect(
        transactions.setupOpenSpaceAccount(admin, admin)
      ).resolves.toBeTruthy()
      await expect(
        transactions.mintOpenSpaceVouchers(admin, alice, [{}])
      ).resolves.toBeTruthy()
      await expect(
        scripts.getOpenSpaceVoucherCollectionLen(admin, alice)
      ).resolves.toEqual(1)
      await expect(
        transactions.sellOpenSpaceItem(
          admin,
          alice,
          setId,
          'packId',
          1.0,
          0.5,
          [{}]
        )
      ).resolves.toBeTruthy()
      await expect(scripts.countSetListings(admin, setId)).resolves.toEqual(1)
      await expect(
        transactions.buyOpenSpaceItemWithFlow(admin, alice, setId)
      ).resolves.toBeTruthy()
      await expect(
        scripts.getOpenSpaceVoucherCollectionLen(admin, alice)
      ).resolves.toEqual(0)
      await expect(scripts.countSetListings(admin, setId)).resolves.toEqual(0)
      await expect(
        scripts.getOpenSpaceCollectionLen(admin, alice)
      ).resolves.toEqual(1)
    }, 10000)
  })
})