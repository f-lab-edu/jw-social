import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsString()
  pageToken?: string;

  @IsOptional()
  @IsNumberString()
  maxPageSize?: number;
}
