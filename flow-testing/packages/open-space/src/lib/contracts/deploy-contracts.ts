import { FlowAccount } from '@flow-testing/flow-testing-utils'
import {
  OpenSpaceAdminNFTStorefront,
  OpenSpaceItems,
} from './contracts'

export const deployContracts = async (admin: FlowAccount) => {
  await admin.deployContract('OpenSpaceItems', OpenSpaceItems)
  return await admin.deployContract(
    'OpenSpaceAdminNFTStorefront',
    OpenSpaceAdminNFTStorefront(admin.getAddress())
  )
}
