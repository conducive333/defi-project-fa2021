import { encodePublicKey, generateKeys } from './keys'
import * as transactions from './transactions'
import { sendTransaction } from './utils'
import { TxArgs } from './types/account'
import { wrapAddress } from './wrappers'
import { getAuthorizer } from './auth'
import * as scripts from './scripts'

export class FlowAccount {
  private readonly keys: string[] = []
  private address: string | undefined = undefined

  /**
   *
   * @returns The authorization function for this account.
   */
  public get authz() {
    if (this.address) {
      return getAuthorizer(this.address, this.keys[0])
    } else {
      throw new Error('Account is not initialized.')
    }
  }

  /**
   *
   * @param wrap If true, wraps the address with an `fcl.arg()` builder.
   * @returns The address of this account.
   */
  public getAddress(wrap?: false): string
  public getAddress(wrap?: true): any
  public getAddress(wrap = false): string | any {
    if (this.address) {
      if (wrap) {
        return wrapAddress(this.address)
      }
      return this.address
    } else {
      throw new Error('Account is not initialized.')
    }
  }

  /**
   *
   * @param address The address to use for the account.
   * @param privKey The private key associated with the account.
   * @returns An abstraction of a Flow account.
   */
  public init = (address: string, privKey: string) => {
    if (!this.address) {
      this.address = address
      this.keys.push(privKey)
      return this
    } else {
      throw new Error('Account is already initialized.')
    }
  }

  /**
   *
   * @returns A Flow account.
   */
  public create = async () => {
    if (!this.address) {
      const keyDuo = generateKeys()
      const pubKey = encodePublicKey(keyDuo.publicKey)
      const flowTx = await transactions.createAccount(pubKey)
      for (const event of flowTx.events) {
        if (event.type === 'flow.AccountCreated') {
          this.keys.push(keyDuo.privateKey)
          this.address = (event as { data: { address: string } }).data.address
          return this
        }
      }
      throw new Error('Address not found.\n' + JSON.stringify(flowTx, null, 2))
    } else {
      throw new Error('Account is already initialized.')
    }
  }

  /**
   *
   * @param param0 An object containing the transaction code and the arguments of the transaction.
   * @returns The result of the transaction.
   */
  public sendTx = async ({ transaction, args }: TxArgs) => {
    if (this.address) {
      return await sendTransaction({
        transaction,
        args,
        authorizations: [this.authz],
        payer: this.authz,
        proposer: this.authz,
      })
    } else {
      throw new Error('Account is not initialized.')
    }
  }

  /**
   *
   * @param name The contract name.
   * @param code The raw contract code.
   * @returns The result of deployment transaction.
   */
  public deployContract = async (name: string, code: string) => {
    if (this.address) {
      await transactions.deployContract(this, name, code)
      return this
    } else {
      throw new Error('Account is not initialized.')
    }
  }

  /**
   *
   * @returns The result of the transaction.
   */
  public setupFUSDVault = async () => {
    if (this.address) {
      await transactions.setupFUSDVault(this)
      return this
    } else {
      throw new Error('Account is not initialized.')
    }
  }

  /**
   *
   * @param amount A number representing the amount of Flow to add to the account.
   * @returns The result of the transaction.
   */
  public fundWithFlow = async (amount: number) => {
    if (this.address) {
      await transactions.mintFlow(this, amount)
      return this
    } else {
      throw new Error('Account is not initialized.')
    }
  }

  /**
   *
   * @param amount A number representing the amount of FUSD to add to the account.
   * @returns The result of the transaction.
   */
  public fundWithFUSD = async (amount: number) => {
    if (this.address) {
      await transactions.mintFUSD(this, amount)
      return this
    } else {
      throw new Error('Account is not initialized.')
    }
  }

  /**
   *
   * @returns True if this account has an FUSD vault and false otherwise.
   */
  public hasFUSDVault = async () => {
    if (this.address) {
      return await scripts.hasFUSDVault(this)
    } else {
      throw new Error('Account is not initialized.')
    }
  }

  /**
   *
   * @returns The FUSD balance of this account.
   */
  public getFUSDBalance = async () => {
    if (this.address) {
      return await scripts.getFUSDBalance(this)
    } else {
      throw new Error('Account is not initialized.')
    }
  }

  /**
   *
   * @returns The Flow token balance of this account.
   */
  public getFlowBalance = async () => {
    if (this.address) {
      return await scripts.getFlowBalance(this)
    } else {
      throw new Error('Account is not initialized.')
    }
  }
}
