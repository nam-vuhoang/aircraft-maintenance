import {
  IsOptional,
  IsString,
  IsArray,
  IsDateString,
  IsNumber,
} from 'class-validator';

export class WorkPackageFilter {
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  registrations?: string[];

  @IsOptional()
  @IsString()
  namePattern?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  stations?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  statuses?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  areas?: string[];

  @IsOptional()
  @IsNumber()
  limit?: number;
}
