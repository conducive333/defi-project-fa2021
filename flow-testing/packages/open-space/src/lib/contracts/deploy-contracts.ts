import { FlowAccount } from '@flow-testing/flow-testing-utils'
import {
  OpenSpaceAdminNFTStorefront,
  OpenSpaceVoucher,
  OpenSpaceItems,
} from './contracts'

export const deployContracts = async (admin: FlowAccount) => {
  await admin.deployContract('OpenSpaceItems', OpenSpaceItems)
  await admin.deployContract('OpenSpaceVoucher', OpenSpaceVoucher)
  return await admin.deployContract(
    'OpenSpaceAdminNFTStorefront',
    OpenSpaceAdminNFTStorefront(admin.getAddress())
  )
}
