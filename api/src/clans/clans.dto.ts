// api/src/clans/clans.dto.ts
// DTOs for clans module

import { IsBoolean, IsOptional, IsString, Length, Matches } from 'class-validator';
import { config } from 'src/config';

/**
 * body for POST /clans
 */
export class CreateClanDto {
  /* short tag, 1–6 alnum */
  @IsString()
  @Length(config.clanLength[0], config.clanLength[1])
  tag: string;

  /* full name, 1–64 chars */
  @IsString()
  @Length(1, 64)
  name: string;

  /* optional hex color like #A1B2C3 */
  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/)
  color?: string;

  /* optional badge file name */
  @IsOptional()
  @IsString()
  badge_file?: string;

  /* optional description */
  @IsOptional()
  @IsString()
  @Length(0, 256)
  description?: string;

  /* allow open join? */
  @IsOptional()
  @IsBoolean()
  is_public?: boolean;
}
