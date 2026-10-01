import { RequerimentType } from '@/domain/entity/Pqrs/requirement';
import RepositoryTypes from '@/domain/entity/Types/RepositoryTypes';
import type IRequirementRepository from '@/domain/repository/Pqrs/IRequirementRepository';
import {inject, injectable} from 'inversify';
import 'reflect-metadata';


@injectable()
export default class GetRequierimentTypesUseCase {
    private requirementRepository: IRequirementRepository;

    constructor(@inject(RepositoryTypes.RequirementRepository) requirementRepository: IRequirementRepository) {
        this.requirementRepository = requirementRepository;
    }

    async execute(): Promise<RequerimentType[]> {
        const requirementTypesList = await this.requirementRepository.getRequerimentTypes({
            page: 1,
            pageSize: 100,
        })

        return requirementTypesList.data
    }
}