import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FlowVoucherService } from './flow-voucher.service';
import { CreateFlowVoucherDto } from './dto/create-flow-voucher.dto';
import { UpdateFlowVoucherDto } from './dto/update-flow-voucher.dto';

@Controller('flow-voucher')
export class FlowVoucherController {
  constructor(private readonly flowVoucherService: FlowVoucherService) {}

  @Post()
  create(@Body() createFlowVoucherDto: CreateFlowVoucherDto) {
    return this.flowVoucherService.create(createFlowVoucherDto);
  }

  @Get()
  findAll() {
    return this.flowVoucherService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flowVoucherService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFlowVoucherDto: UpdateFlowVoucherDto) {
    return this.flowVoucherService.update(+id, updateFlowVoucherDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.flowVoucherService.remove(+id);
  }
}
