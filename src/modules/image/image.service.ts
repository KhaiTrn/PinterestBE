import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { PrismaService } from '../prisma/prisma.service';
import { contains } from 'class-validator';

@Injectable()
export class ImageService {
  constructor(private prisma: PrismaService) {}
  create(createImageDto: CreateImageDto) {
    return 'This action adds a new image';
  }

  async findAll() {
    const images = await this.prisma.images.findMany();
    return images;
  }
  async getBySearch(query: any) {
    let { page, pageSize, search } = query;
    page = +page > 0 ? +page : 1;
    pageSize = +pageSize > 0 ? +pageSize : 10;
    search = search || '';
    const skip = (page - 1) * pageSize;
    // containts :search theo từ khóa
    const whereSearch =
      search.trim() == `` ? {} : { image_name: { contains: search } };
    const totalItem = await this.prisma.images.count({ where: whereSearch });
    const totalPage = Math.ceil(totalItem / pageSize);
    const images = this.prisma.images.findMany({
      take: pageSize,
      skip: skip,
      orderBy: { created_at: `desc` },
    });
    return {
      page,
      pageSize,
      totalItem,
      totalPage,
      item: images || [],
    };
  }
  async findOne(id: number) {
    const image = await this.prisma.images.findUnique({
      where: { image_id: id },
    });
    return image;
  }

  async update(id: number, updateImageDto: UpdateImageDto) {
    const { image_name, image, title, description } = updateImageDto;
    const imageUpdated = await this.prisma.images.update({
      where: { image_id: id },
      data: { image_id: id, image_name, image, title, description },
    });
    return imageUpdated;
  }

  remove(id: number) {
    const image = this.prisma.images.delete({ where: { image_id: id } });
    return image;
  }
}
