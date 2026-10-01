import { items } from "./HowPMEWorks.config"

const HowPMEWorks = () => {
    return (
        <section className="p-6 md:px-16 md:py-10 flex flex-col gap-6 md:gap-10 text-center bg-darkGrayishBlue-50" aria-labelledby="how-pm-works-title">
            <div className="flex flex-col gap-4 home-body-container">
                <h3 id="how-pm-works-title" className="text-[28px] text-blue-500 typo-main-title">
                    ¿Cómo funciona Pichincha Miles?
                </h3>
                <p className="text-grayscale-500">Acumular y canjear es muy simple</p>
            </div>

            <ul className="flex flex-col gap-y-6 md:grid md:grid-cols-3 w-full home-body-container list-none p-0 m-0">
                {items.map((item) => (
                    <li className="py-2 flex flex-col  gap-3 md:gap-6 items-center md:p-4" key={item.title}>
                        <span className="w-16 h-16 rounded-full bg-darkGrayishBlue-200 flex items-center justify-center text-blue-500" aria-hidden="true">
                            {item.icon}
                        </span>
                        <div className="space-y-2">
                            <h4 className="font-semibold text-lg text-blue-500">
                                {item.title}
                            </h4>
                            <p className="text-grayscale-500">{item.description}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default HowPMEWorks
