import { Requeriment } from '@/domain/entity/Pqrs/requirement';
import RepositoryTypes from '@/domain/entity/Types/RepositoryTypes';
import type IRequirementRepository from '@/domain/repository/Pqrs/IRequirementRepository';
import RecaptchaService from '@/domain/services/RecaptchaService';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export default class CreateRequerimentUseCase {
    private requerimentRepository: IRequirementRepository

    constructor(@inject(RepositoryTypes.RequirementRepository) requerimentRepository: IRequirementRepository) {
        this.requerimentRepository = requerimentRepository
    }

    async addPqrs(requeriment: Requeriment): Promise<void> {
        const recaptchaAction = 'PqrsRequest';
        const recaptchaToken = await RecaptchaService.getToken(recaptchaAction)

        return this.requerimentRepository.createRequeriment(requeriment, recaptchaAction, recaptchaToken)
    }

}