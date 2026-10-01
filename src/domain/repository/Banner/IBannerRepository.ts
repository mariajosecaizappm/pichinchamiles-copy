import { Banner, BannerParams } from "@/domain/entity/Banner/banner";
import { List } from "@/domain/entity/List/list";

export default interface IBannerRepository {
  getBanners(params: BannerParams): Promise<List<Banner>>;
}
