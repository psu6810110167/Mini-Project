import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

// ต้องมีคำว่า export ข้างหน้า class
export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

// ต้องมีคำว่า export ข้างหน้า class
export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}