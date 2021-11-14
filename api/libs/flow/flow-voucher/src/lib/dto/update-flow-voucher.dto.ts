import { PartialType } from '@nestjs/swagger';
import { CreateFlowVoucherDto } from './create-flow-voucher.dto';

export class UpdateFlowVoucherDto extends PartialType(CreateFlowVoucherDto) {}
