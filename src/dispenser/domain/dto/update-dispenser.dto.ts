import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum } from 'class-validator';

export enum DispenserStatus {
  OPEN = 'open',
  CLOSE = 'close',
}

export class UpdateDispenserDto {
  @ApiProperty({
    description: 'Status of the flow dispenser',
    enum: DispenserStatus,
    example: 'open',
  })
  @IsEnum(DispenserStatus)
  status: DispenserStatus;

  @ApiProperty({
    type: Date,
    description: 'Timestamp for the update',
    example: '2022-01-01T02:00:00Z',
  })
  @IsDateString()
  updated_at: string;
}
