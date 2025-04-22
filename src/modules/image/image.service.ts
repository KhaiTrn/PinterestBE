import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { PrismaService } from '../prisma/prisma.service';
import { contains } from 'class-validator';
import {
  BASE_URL,
  CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_SECRET_KEY,
} from 'src/common/constant/app.constant';
import { v2 as cloudinary } from 'cloudinary';
import { error } from 'console';
import { resolve } from 'path';
@Injectable()
export class ImageService {
  constructor(private prisma: PrismaService) {}
  async uploadLocal(file, createImageDto, req) {
    if (!file)
      throw new BadRequestException(
        'Vui lòng upload file đúng định dạng với key(form-data)',
      );
    let { title, description } = createImageDto;
    title = title ? title : '';
    description = description ? description : '';
    const { user } = req;
    const imgUrl = `${BASE_URL}/upload/${file.filename}`;
    const fileNew = await this.prisma.images.create({
      data: {
        user_id: user.user_id,
        image: imgUrl,
        title,
        description,
      },
      select: {
        image: true,
        title: true,
        description: true,
        created_at: true,
      },
    });
    return fileNew;
  }

  async uploadCloud(file, createImageDto, req) {
    if (!file)
      throw new BadRequestException(
        'Vui lòng upload file đúng định dạng với key(form-data)',
      );
    const { user } = req;
    let { title, description } = createImageDto;
    title = title ? title : '';
    description = description ? description : '';
    // Configuration
    cloudinary.config({
      cloud_name: CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_SECRET_KEY, // Click 'View API Keys' above to copy your API secret
    });

    // Upload an image
    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'images1' }, (error, result) => {
          if (error) return reject(error);
          return resolve(result);
        })
        .end(file.buffer);
    });
    console.log(uploadResult);
    const imageNew = this.prisma.images.create({
      data: {
        user_id: user.user_id,
        image: uploadResult.secure_url,
        image_name: uploadResult.display_name,
        title,
        description,
      },
      select: {
        image: true,
        image_id: true,
        image_name: true,
        title,
        description,
        created_at: true,
      },
    });
    return imageNew;
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
      include: { comments: true },
    });
    if (!image) {
      throw new BadRequestException('không tìm thấy image');
    }
    return image;
  }

  async update(id: number, updateImageDto: UpdateImageDto) {
    let { image_name, image, title, description } = updateImageDto;
    console.log(updateImageDto);
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
