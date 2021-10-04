import { NftEvent, NftEventType } from '@api/database'
import { Injectable } from '@nestjs/common'
import { getConnection } from 'typeorm'

@Injectable()
export class FlowEventsService {
  // TODO: Test this
  async mintedCardIdToMintEvent(mintedCardId: string) {
    // The mint event contains the mapping from NFT ID to minted card ID
    return await getConnection().transaction(async (tx) => {
      return await tx.findOne(NftEvent, {
        where: {
          eventType: NftEventType.minted,
          mintedCardId: mintedCardId,
        },
      })
    })
  }

  // TODO: Test this
  async currentOwner(nftId: string) {
    // The latest deposit event for this NFT ID contains the address of the current owner
    return await getConnection().transaction(async (tx) => {
      return await tx.findOne(NftEvent, {
        where: {
          eventType: NftEventType.deposit,
          nftId: nftId,
        },
        order: {
          createdAt: 'DESC',
          eventIndex: 'DESC',
        },
      })
    })
  }
}
