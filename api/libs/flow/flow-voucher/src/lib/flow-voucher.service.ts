import { Injectable } from '@nestjs/common';
import { CreateFlowVoucherDto } from './dto/create-flow-voucher.dto';
import { UpdateFlowVoucherDto } from './dto/update-flow-voucher.dto';

@Injectable()
export class FlowVoucherService {
  create(createFlowVoucherDto: CreateFlowVoucherDto) {
    return 'This action adds a new flowVoucher';
  }

  findAll() {
    return `This action returns all flowVoucher`;
  }

  findOne(id: number) {
    return `This action returns a #${id} flowVoucher`;
  }

  update(id: number, updateFlowVoucherDto: UpdateFlowVoucherDto) {
    return `This action updates a #${id} flowVoucher`;
  }

  remove(id: number) {
    return `This action removes a #${id} flowVoucher`;
  }
}
