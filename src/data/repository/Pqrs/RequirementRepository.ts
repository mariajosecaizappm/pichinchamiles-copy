
import { getRequirementTypesAdapter } from "@/data/adapters/Pqrs/requirementAdapter";
import AlgoliaClient from "@/data/provider/algolia/algoliaClient";
import { AlgoliaIndex } from "@/data/provider/algolia/types";
import axPrivate from "@/data/provider/axios/axiosPrivate";
import { List } from "@/domain/entity/List/list";
import { Requeriment, RequerimentType, RequerimentTypeListParams } from "@/domain/entity/Pqrs/requirement";
import IRequirementRepository from "@/domain/repository/Pqrs/IRequirementRepository";
import { injectable } from "inversify";
import "reflect-metadata";
import RepositoryBase from "../RepositoryBase";

@injectable()
export default class RequirementRepository extends RepositoryBase implements IRequirementRepository {
    private algoliaClient = new AlgoliaClient(AlgoliaIndex.PQRS);
    async getRequerimentTypes(params: RequerimentTypeListParams): Promise<List<RequerimentType>> {
        const { list } = await this.algoliaClient.search({
            params: {
                ...params,
                type: "pqrsrequirementtype",
                programId: this.programId
            },
            adapter: getRequirementTypesAdapter
        })

        return list
    }

    createRequeriment(requeriment: Requeriment, recaptchaAction: string, recaptchaToken: string): Promise<void> {
        const url = `${this.pqrsPrefix}/${this.programId}/help-form-responses`;
        return axPrivate.post(url, requeriment, {
            headers: {
                "Recaptchaaction": recaptchaAction,
                "Recaptchatoken": recaptchaToken
            }
        });
    }
}