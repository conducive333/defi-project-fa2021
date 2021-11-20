import { Injectable } from '@nestjs/common'

@Injectable()
export abstract class FlowAuthService {
  public abstract authz(address: string, keyIndex: number): unknown
}
