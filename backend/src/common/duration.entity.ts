/**
 * The base entity for entities with a duration.
 */
export interface DurationEntity {
  get id(): string;
  get start(): Date;
  get end(): Date;
}
