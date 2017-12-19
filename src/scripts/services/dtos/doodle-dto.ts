import { DoodleOptionDto } from './doodle-option-dto';

export interface DoodleDto {
    id: number;
    label: string;
    options: DoodleOptionDto[]
}