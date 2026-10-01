"use client"
type Props = { title: string }

const PageTitle = ({ title }: Props) => {
    return (
        <section className="h-full w-full">
            <header className="flex w-full">
                <div className="flex-row">
                    <div className="flex-row">
                        <h1 className="self-stretch justify-center  md:text-[2em] text-[1.5em] font-semibold">
                            {title}
                        </h1>
                    </div>
                </div>
            </header>
        </section>
    )
}

export default PageTitle
