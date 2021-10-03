import { FlowTypes } from '@doosan/flow/flow-service'
import { Injectable } from '@nestjs/common'
import * as fcl from '@onflow/fcl'
import { ec as EC } from 'elliptic'
import { SHA3 } from 'sha3'

const ec = new EC('p256')

@Injectable()
export abstract class FlowAuthService {
  protected static readonly MASTER_KEY_INDEX = 0

  abstract developerAuthenticate(index: number): unknown
  abstract treasuryAuthenticate(): unknown

  constructor(
    public readonly developerAddress: string,
    public readonly treasuryAddress: string
  ) {}

  public authenticate = (
    address: string,
    keyIndex: number,
    privateKey: string
  ) => {
    return (account: FlowTypes.AuthAccount | Record<string, unknown> = {}) => {
      const addr = address
      const indx = keyIndex
      const prvk = privateKey
      const sign = this.signWithKey
      return {
        ...account,
        tempId: `${addr}-${indx}`,
        addr: fcl.sansPrefix(addr),
        keyId: Number(indx),
        signingFunction: (signable: any) => ({
          addr: fcl.withPrefix(addr),
          keyId: Number(indx),
          signature: sign(prvk, signable.message),
        }),
      }
    }
  }

  private hashMsg = (msg: string) => {
    const sha = new SHA3(256)
    sha.update(Buffer.from(msg, 'hex'))
    return sha.digest()
  }

  private signWithKey = (privateKey: string, msg: string) => {
    const key = ec.keyFromPrivate(Buffer.from(privateKey, 'hex'))
    const sig = key.sign(this.hashMsg(msg))
    const n = 32
    const r = sig.r.toArrayLike(Buffer, 'be', n)
    const s = sig.s.toArrayLike(Buffer, 'be', n)
    return Buffer.concat([r, s]).toString('hex')
  }
}
