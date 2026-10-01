"use client"

import { Banner } from "@/domain/entity/Banner/banner";
import AssetImage from "@/presentation/components/AssetImage";
import IconChevronRight from "@/presentation/components/icons/IconChevronRight";
import useSession from "@/presentation/hooks/useSession";
import { openAuthModal } from "@/presentation/redux/features/authModalSlice";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { getRedemptionCategoryCta } from "../HomeRedemptionCategoriesConfig";

const HomeRedemptionCategoryItemCard = ({ redemptionCategory }: { redemptionCategory: Banner }) => {
    const dispatch = useDispatch();
    const { isLogged } = useSession();
    const ctaText = getRedemptionCategoryCta(redemptionCategory.title);

    const handleOpenAuthModal = () => dispatch(openAuthModal());

    const ctaClassName = "cursor-pointer flex items-center gap-2";

    return (
        <div className="flex flex-col rounded-lg border border-darkGrayishBlue-500 overflow-hidden text-left h-full min-w-75">
            <div className="min-h-38.75">
                <AssetImage
                    asset={redemptionCategory.image}
                    alt={redemptionCategory.title}
                    width={300}
                    height={155}
                    breakpoint={640}
                    className="object-cover w-full h-full"
                />
            </div>
            <div className="p-5 flex flex-col gap-2 h-full text-grayscale-500">
                <p className="font-semibold text-xl">{redemptionCategory.title}</p>
                <p className="flex-1">{redemptionCategory.description}</p>
                <div className="text-information-500 font-semibold">
                    <div className="w-min whitespace-nowrap hover:underline">
                        {isLogged && redemptionCategory.link ? (
                            <Link
                                href={redemptionCategory.link}
                                className={ctaClassName}
                                aria-label={`${ctaText}: ${redemptionCategory.title}`}
                            >
                                <span>{ctaText}</span>
                                <span className="w-5 h-5 flex items-center justify-center" aria-hidden="true">
                                    <IconChevronRight />
                                </span>
                            </Link>
                        ) : (
                            <button
                                type="button"
                                className={ctaClassName}
                                onClick={handleOpenAuthModal}
                                aria-label={`${ctaText}, iniciar sesión en Pichincha Miles`}
                            >
                                <span>{ctaText}</span>
                                <span className="w-5 h-5 flex items-center justify-center" aria-hidden="true">
                                    <IconChevronRight />
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeRedemptionCategoryItemCard;
