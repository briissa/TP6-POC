import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import type { SimulateFailure } from '@poc/contracts';

export class CreateActivationDto {
  @IsString()
  @MinLength(1)
  customerId!: string;

  @IsString()
  @MinLength(1)
  planId!: string;

  @IsOptional()
  @IsIn(['none', 'billing', 'provisioning'])
  simulateFailure?: SimulateFailure;

  @IsOptional()
  @IsString()
  channel?: string;
}