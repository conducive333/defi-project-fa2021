import { FlowAccount } from '@flow-testing/flow-testing-utils'
import {
  OpenSpaceAdminNFTStorefront,
  OpenSpaceItems,
  OpenSpaceNFTStorefront,
  OpenSpaceVoucher,
} from './contracts'

export const deployContracts = async (admin: FlowAccount) => {
  await admin.deployContract('OpenSpaceItems', OpenSpaceItems)
  await admin.deployContract('OpenSpaceVoucher', OpenSpaceVoucher)
  await admin.deployContract(
    'OpenSpaceAdminNFTStorefront',
    OpenSpaceAdminNFTStorefront(admin.getAddress())
  )
  return await admin.deployContract(
    'OpenSpaceNFTStorefront',
    OpenSpaceNFTStorefront(admin.getAddress())
  )
}
