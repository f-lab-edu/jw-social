import {
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @IsNotEmpty()
  password: string;

  @IsUrl()
  @IsOptional()
  avatar?: string;
}
