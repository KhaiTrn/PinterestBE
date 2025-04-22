import { BadRequestException, Body, Injectable, Req } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}
  async create(req, createCommentDto: CreateCommentDto) {
    const { user } = req;
    let { image_id, content } = createCommentDto;

    const commentNew = await this.prisma.comments.create({
      data: {
        user_id: user.user_id,
        image_id: Number(image_id),
        content: content,
      },
    });
    return commentNew;
  }

  async findAll(query) {
    let { page, pageSize, search } = query;
    page = +page > 0 ? +page : 1;
    (pageSize = +pageSize > 0 ? +pageSize : 10), (search = search || '');

    const whereSearch = search.trim() == '' ? {} : { contains: search };
    const totalItem = await this.prisma.comments.count({
      where: { content: whereSearch },
    });
    const totalPage = Math.ceil(totalItem / pageSize);
    const skip = (page - 1) * pageSize;
    const comments = await this.prisma.comments.findMany({
      take: pageSize,
      skip: skip,
      where: { content: whereSearch },
    });
    return {
      page,
      pageSize,
      totalItem,
      totalPage,
      items: comments || [],
    };
  }

  async findOne(id: number) {
    const comment = await this.prisma.comments.findUnique({
      where: { comment_id: id },
    });
    if (!comment) throw new BadRequestException('không tìm thấy comment');
    return comment;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    let { content } = updateCommentDto;
    const imageUpdate = await this.prisma.comments.update({
      where: { comment_id: id },
      data: {
        content: content,
      },
    });
    return imageUpdate;
  }

  async remove(id: number) {
    const isCommentExist = await this.prisma.comments.findUnique({
      where: { comment_id: id },
    });
    console.log(isCommentExist);
    if (!isCommentExist) {
      throw new BadRequestException('không có comments để xóa');
    }
    const imageDelelte = await this.prisma.comments.delete({
      where: { comment_id: id },
    });
    return imageDelelte;
  }
}
