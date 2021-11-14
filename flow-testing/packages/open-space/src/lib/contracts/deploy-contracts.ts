import {
  OpenSpaceAdminNFTStorefront,
  OpenSpaceItems,
  OpenSpaceVoucher,
} from './contracts'
import { FlowAccount } from '@flow-testing/flow-testing-utils'

export const deployContracts = async (admin: FlowAccount) => {
  await admin.deployContract('OpenSpaceItems', OpenSpaceItems)
  await admin.deployContract('OpenSpaceVoucher', OpenSpaceVoucher)
  return await admin.deployContract(
    'OpenSpaceAdminNFTStorefront',
    OpenSpaceAdminNFTStorefront(admin.getAddress())
  )
}
