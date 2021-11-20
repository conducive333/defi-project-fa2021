import { FlowAuthService } from './authorizer.service'
import { ConfigService } from '@nestjs/config'
import { AuthAccount } from '../types/onflow.types'
import { Injectable } from '@nestjs/common'
import { ec as EC } from 'elliptic'
import * as fcl from '@onflow/fcl'
import { SHA3 } from 'sha3'

const ec = new EC('p256')

@Injectable()
export class DefaultAuthorizer extends FlowAuthService {
  protected readonly privateKey: string

  constructor(configService: ConfigService) {
    super()
    this.privateKey = configService.get<string>('FLOW_MASTER_KEY')!
  }

  authz = (address: string, keyIndex: number) => {
    return (account: AuthAccount | Record<string, unknown> = {}) => {
      const addr = address
      const indx = keyIndex
      const prvk = this.privateKey
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
