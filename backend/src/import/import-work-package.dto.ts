import { IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ImportWorkPackageDto {
  @ApiProperty({
    example: 'WP12345',
    description: 'The unique identifier of the work package',
  })
  @IsString()
  workPackageId: string;

  @ApiProperty({
    example: 'ABC123',
    description: 'The registration number of the work package',
  })
  @IsString()
  registration: string;

  @ApiProperty({
    example: 'Maintenance A',
    description: 'The name of the work package',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'HEL',
    description: 'The station where the work package is executed',
  })
  @IsString()
  station: string;

  @ApiProperty({
    example: 'OPEN',
    description: 'The status of the work package',
  })
  @IsString()
  status: string;

  @ApiProperty({
    example: 'APRON',
    description: 'The area of the work package',
  })
  @IsString()
  area: string;

  @ApiProperty({
    example: '2024-04-16T08:00:00Z',
    description: 'The start time of the work package',
  })
  @IsDateString()
  startDateTime: string;

  @ApiProperty({
    example: '2024-04-16T09:30:00Z',
    description: 'The end time of the work package',
  })
  @IsDateString()
  endDateTime: string;
}
