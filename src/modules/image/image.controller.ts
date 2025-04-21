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
  UploadedFile,
  Req,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { ResponseSuccess } from 'src/common/decorators/response-success.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import uploadLocal from 'src/common/multer/local.multer';
@ApiBearerAuth()
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

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

  @Post(`upload-local`)
  @UseInterceptors(FileInterceptor('image', uploadLocal))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
        title: { type: 'string', format: 'Body' },
        description: { type: 'string' },
      },
    },
  })
  async uploadLocal(
    @UploadedFile() file,
    @Query() query: any,
    @Body() createImageDto: CreateImageDto,
    @Req() req: any,
  ) {
    return await this.imageService.uploadLocal(file, createImageDto, req);
  }
  @Post(`upload-cloud`)
  @UseInterceptors(FileInterceptor('image'))
  async uploadCloud(
    @UploadedFile() file,
    @Body() createImageDto: CreateImageDto,
    @Req() req: any,
  ) {
    return await this.imageService.uploadCloud(file, createImageDto, req);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imageService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateImageDto: UpdateImageDto,
  ) {
    console.log(updateImageDto);
    return await this.imageService.update(+id, updateImageDto);
  }

  @ResponseSuccess('xóa dữ liêu thành công')
  @Delete(':id')
  remove(@Param('id') id: string) {
    this.imageService.remove(+id);
  }
}
