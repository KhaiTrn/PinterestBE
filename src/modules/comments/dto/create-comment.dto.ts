import { IsEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  image_id: string;
  @IsString()
  content: string;
}
