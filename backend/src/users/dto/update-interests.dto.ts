import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class UpdateInterestsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  categoryIds!: string[];
}
