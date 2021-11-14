import { signWithKey } from './keys'
import * as fcl from '@onflow/fcl'

export const getAuthorizer = (
  address: string,
  privateKey: string,
  keyIndex = 0
) => {
  return (account: Record<string, unknown> = {}) => {
    const addr = address
    const prvk = privateKey
    const indx = keyIndex
    const sign = signWithKey
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
