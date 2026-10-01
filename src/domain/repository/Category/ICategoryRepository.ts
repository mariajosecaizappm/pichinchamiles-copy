
import { Category, CategoryParams } from "@/domain/entity/Category/structure/category";
import { List } from "@/domain/entity/List/list";

export default interface ICategoryRepository{
    getCategories(params: CategoryParams): Promise<List<Category>>
}