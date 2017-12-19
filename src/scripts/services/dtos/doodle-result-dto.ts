import { DoodleDto } from './doodle-dto';

export interface DoodleResultDto {
    doodle: DoodleDto;
    results: { [participant: string]: number[] };
}