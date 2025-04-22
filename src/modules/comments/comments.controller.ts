import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ResponseSuccess } from 'src/common/decorators/response-success.decorator';
@ResponseSuccess('ok')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Req() req: any, @Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(req, createCommentDto);
  }

  @Get()
  findAll(
    @Query() query: any,
    @Query(`page`) page?: string,
    @Query(`pageSize`) pageSize?: string,
    @Query(`search`) search?: string,
  ) {
    return this.commentsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.commentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }
  @ResponseSuccess('xóa thành công')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.commentsService.remove(+id);
  }
}
