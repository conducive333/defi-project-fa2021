import { OpenSpaceAdminNFTStorefront } from './OpenSpaceAdminNFTStorefront'
import { FlowAccount } from '@flow-testing/flow-testing-utils'
import { OpenSpaceVoucher } from './OpenSpaceVoucher'
import { OpenSpaceItems } from './OpenSpaceItems'

export const deployContracts = async (admin: FlowAccount) => {
  await admin.deployContract('OpenSpaceItems', OpenSpaceItems)
  await admin.deployContract('OpenSpaceVoucher', OpenSpaceVoucher)
  return await admin.deployContract(
    'OpenSpaceAdminNFTStorefront',
    OpenSpaceAdminNFTStorefront(admin.getAddress())
  )
}
