import { AppModule } from './app/app.module'
import { NestFactory } from '@nestjs/core'
import { FlowService } from '@api/flow/flow-service'
import { ConfigService } from '@nestjs/config'
import { NFTListener } from './nft/nft.listener'
import { StorefrontListener } from './storefront/storefront.listener'

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule)
  const conf = app.get(ConfigService)
  FlowService.setAccessNode(conf.get<string>('FLOW_ACCESS_API'))
  if (process.env.EVENT_LISTENER === 'nft') {
    const listener = app.get(NFTListener)
    listener.listen(5, 5000)
  } else if (process.env.EVENT_LISTENER === 'storefront') {
    const listener = app.get(StorefrontListener)
    listener.listen(5, 5000)
  } else {
    throw new Error('Invalid event listener.')
  }
}

bootstrap()
