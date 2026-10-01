
import { Brand } from "@/domain/entity/Brand/brand";
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes";
import type IBrandRepository from "@/domain/repository/Brand/IBrandRepository";
import { inject, injectable } from "inversify";
import "reflect-metadata";

@injectable()
export default class GetProductBrandsUseCase {
    private readonly brandRepository: IBrandRepository;

    constructor(@inject(RepositoryTypes.BrandRepository) brandRepository: IBrandRepository) {
        this.brandRepository = brandRepository;
    }

    async getBrands(brandIds?: string[]): Promise<Brand[]>{
        const { data } = await this.brandRepository.getBrands({
            id: brandIds,
            pageSize: 600
        })

        return data
    }
}