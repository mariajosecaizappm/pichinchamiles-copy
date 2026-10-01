import { Brand, BrandParams } from "@/domain/entity/Brand/brand";
import { List } from "@/domain/entity/List/list";



export default interface IBrandRepository{
    getBrands(params: BrandParams): Promise<List<Brand>>
}