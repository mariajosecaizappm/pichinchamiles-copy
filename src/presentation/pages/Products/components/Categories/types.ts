import { CategoryGroup } from "@/domain/entity/Category/structure/category";

export type CategoryWithCount = CategoryGroup & {
    count: number;
}
