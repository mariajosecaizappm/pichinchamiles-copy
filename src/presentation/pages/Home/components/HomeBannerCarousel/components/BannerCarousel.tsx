"use client"

import { Banner } from "@/domain/entity/Banner/banner";
import { Carousel } from "react-responsive-carousel";

const BannerCarousel = ({
    banners,
    renderBanner,
}: {
    banners: Banner[];
    renderBanner: (banner: Banner, isMainBanner: boolean) => React.ReactNode;
}) => {
    return (
        <section
            aria-label="Banners promocionales"
            aria-roledescription="carrusel"
        >
            <Carousel
                labels={{
                    leftArrow: "Diapositiva anterior",
                    rightArrow: "Siguiente diapositiva",
                    item: "Diapositiva",
                }}
                preventMovementUntilSwipeScrollTolerance={true}
                swipeScrollTolerance={80}
                showStatus={false}
                showArrows={false}
                showThumbs={false}
                autoPlay={false}
                showIndicators={banners.length > 1}
                renderIndicator={(onClickHandler, isSelected, index) => (
                    <li className="inline-block p-3 mx-1 w-6 h-6 relative">
                        <button
                            className={`w-2 h-2 rounded-full absolute cursor-pointer top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${isSelected ? 'bg-yellow-500' : 'bg-blue-100'}`}
                            onClick={onClickHandler}
                            aria-label={isSelected ? `Diapositiva ${index + 1} de ${banners.length}, seleccionada` : `Ir a diapositiva ${index + 1} de ${banners.length}`}
                            aria-current={isSelected ? "true" : "false"}
                            onKeyDown={onClickHandler}
                            tabIndex={0}
                            key={index}
                        />
                    </li>

                )}
            >
                {banners.map((banner, index) => (
                    <article
                        key={banner.id}
                        aria-label={`Diapositiva ${index + 1} de ${banners.length}: ${banner.title}`}
                        aria-roledescription="diapositiva"
                    >
                        {renderBanner(banner, index === 0)}
                    </article>
                ))}
            </Carousel>
        </section>
    );
};

export default BannerCarousel;

