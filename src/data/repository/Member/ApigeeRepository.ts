import {injectable} from "inversify";
import "reflect-metadata"
import RepositoryBase from "@/data/repository/RepositoryBase";
import IApigeeRepository from "@/domain/repository/Member/IApigeeRepository";
import axPrivate from "@/data/provider/axios/axiosPrivate";
import {Consent, ConsentRegister} from "@/domain/entity/Member/consent";
import {consentAdapter, getCifAdapter} from "@/data/adapters/Member/apigeeAdapter";

@injectable()
export default class ApigeeRepository extends RepositoryBase implements IApigeeRepository {
    async getCif(): Promise<string | null> {
        try{
            const url = `${this.identityPrefix}/users/members/cif`;
            const { data } = await axPrivate.get(url) 
            return getCifAdapter(data)
        }catch{
            return null
        }
    }

    async getConsent(cif: string): Promise<Consent | null> {
        if(!cif) return null;

        try{
            const url = `${this.identityPrefix}/users/members/consent/lopd?clientIdentifierField=${cif}`;
            const { data } = await axPrivate.get(url);
            return consentAdapter(data)
        }catch{
            return null;
        }
    }

    async updateConsent(consentRegister: ConsentRegister): Promise<void> {
        try{
            const url = `${this.identityPrefix}/users/members/consent/lopd`;
            await axPrivate.post(url, consentRegister)
        }catch{
            return;
        }
    }
}