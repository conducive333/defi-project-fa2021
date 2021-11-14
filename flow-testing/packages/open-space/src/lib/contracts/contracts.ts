import { CONSTANTS } from '@flow-testing/flow-testing-utils'
import * as path from 'path'
import * as fs from 'fs'

const CONTRACTS_PATH = path.join(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  '..',
  '..',
  'cadence',
  'contracts',
  'custom'
)

export const OpenSpaceItems = fs
  .readFileSync(path.resolve(CONTRACTS_PATH, 'OpenSpaceItems.cdc'), 'utf8')
  .replace(
    '"../standard/NonFungibleToken.cdc"',
    CONSTANTS.NON_FUNGIBLE_TOKEN_ADDRESS
  )

export const OpenSpaceVoucher = fs
  .readFileSync(path.resolve(CONTRACTS_PATH, 'OpenSpaceVoucher.cdc'), 'utf8')
  .replace(
    '"../standard/NonFungibleToken.cdc"',
    CONSTANTS.NON_FUNGIBLE_TOKEN_ADDRESS
  )

export const OpenSpaceAdminNFTStorefront = (adminAddress: string) =>
  fs
    .readFileSync(
      path.resolve(CONTRACTS_PATH, 'OpenSpaceAdminNFTStorefront.cdc'),
      'utf8'
    )
    .replace(
      '"../standard/NonFungibleToken.cdc"',
      CONSTANTS.NON_FUNGIBLE_TOKEN_ADDRESS
    )
    .replace(
      '"../standard/FungibleToken.cdc"',
      CONSTANTS.FUNGIBLE_TOKEN_ADDRESS
    )
    .replace('"./OpenSpaceVoucher.cdc"', adminAddress)
    .replace('"./OpenSpaceItems.cdc"', adminAddress)

export const OpenSpaceNFTStorefront = (adminAddress: string) =>
  fs
    .readFileSync(
      path.resolve(CONTRACTS_PATH, 'OpenSpaceNFTStorefront.cdc'),
      'utf8'
    )
    .replace(
      '"../standard/NonFungibleToken.cdc"',
      CONSTANTS.NON_FUNGIBLE_TOKEN_ADDRESS
    )
    .replace(
      '"../standard/FungibleToken.cdc"',
      CONSTANTS.FUNGIBLE_TOKEN_ADDRESS
    )
    .replace('"./OpenSpaceItems.cdc"', adminAddress)
