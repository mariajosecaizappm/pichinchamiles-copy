import { injectable } from 'inversify';
import 'reflect-metadata';
import UltraviajesService from '@/domain/services/UltraviajesService';
import { TravelType } from '@/domain/entity/Travel/structure/travels';
import { DisneyParams } from '@/domain/entity/Travel/structure/disney';
import { parseDisneyParamsToStructure } from '@/domain/entity/Travel/models/parseDisneyParamsToStructure';

@injectable()
export default class GetDisneySearchUrlUseCase {
    execute(params: DisneyParams): string {
        const baseUrl = UltraviajesService.getBaseUrl(TravelType.DISNEY);
        const { adults, children, date } = parseDisneyParamsToStructure(params);

        return `${baseUrl}/disney/recommendations?${adults}&${children}&${date}`;
    }
}
