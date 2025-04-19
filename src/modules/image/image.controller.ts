import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ApiAcceptedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ResponseSuccess } from 'src/decorators/response-success.decorator';
@ApiBearerAuth()
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  create(@Body() createImageDto: CreateImageDto) {
    return this.imageService.create(createImageDto);
  }

  @Get()
  findAll() {
    return this.imageService.findAll();
  }

  @Get(`phan-trang-tim-kiem`)
  async getBySearch(
    @Query() query: any,
    @Query(`page`) page: string,
    @Query(`pageSize`) pageSize: string,
  ) {
    const result = await this.imageService.getBySearch(query);
    return result;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imageService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
    return this.imageService.update(+id, updateImageDto);
  }

  @ResponseSuccess('xóa dữ liêu thành công')
  @Delete(':id')
  remove(@Param('id') id: string) {
    this.imageService.remove(+id);
  }
}
