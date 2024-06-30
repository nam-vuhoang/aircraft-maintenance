import { IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * ImportWorkPackageDto is a data transfer object (DTO) class
 * that defines the shape of the data that the client should
 * send to the server when importing a work package.
 */
export class ImportWorkPackageDto {
  @ApiProperty()
  @IsString()
  workPackageId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  station: string;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsString()
  area: string;

  @ApiProperty()
  @IsString()
  registration: string;

  @ApiProperty()
  @IsDateString()
  startDateTime: string;

  @ApiProperty()
  @IsDateString()
  endDateTime: string;
}
