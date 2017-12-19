import { DoodleDto, DoodleResultDto } from '../dtos';

export class DoodleResult implements DoodleResultDto {
    doodle: DoodleDto;
    results: { [participant: string]: number[] };

    constructor(doodle: DoodleDto) {
        this.doodle = doodle;
        this.results = {};
    }

    isOptionSelected = (participant: string, optionId: number) => {
        return this.results[participant] != null &&
            this.results[participant].indexOf(optionId) >= 0;
    }

    selectOption = (participant: string, optionId: number) => {
        this.results[participant] = this.results[participant] || [];
        if (this.results[participant].indexOf(optionId) < 0) {
            this.results[participant].push(optionId);
        }
    }

    removeOption = (participant: string, optionId: number) => {
        this.results[participant] = this.results[participant] || [];
        if (this.results[participant] != null) {
            const index = this.results[participant].indexOf(optionId);
            if (index >= 0) {
                this.results[participant].splice(index, 1);
            }
        }
    }

    get selectedOption() {
        let selectedOptionId = -1;
        let maxOptionCount = 0;

        Object.keys(this.results).reduce((countArray, participant) => {
            var participantOptionIds = this.results[participant];
            participantOptionIds.forEach(optionId => {
                countArray[optionId] = countArray[optionId] || 0;
                countArray[optionId]++;

                if (countArray[optionId] > maxOptionCount) {
                    maxOptionCount = countArray[optionId];
                    selectedOptionId = optionId;
                }
            });

            return countArray;
        }, {});

        return selectedOptionId >= 0 ? this.doodle.options.find(opt => opt.id == selectedOptionId) : null;
    }

    get participantsCount() {
        return Object.keys(this.results).length;
    }
};