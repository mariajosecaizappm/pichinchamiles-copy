const pulseClassName = "animate-pulse rounded bg-darkGrayishBlue-100"

const TransferMilesSkeleton = () => (
    <main
        aria-busy="true"
        aria-label="Cargando transferencia de millas"
        className="mx-auto flex w-full max-w-[624px] flex-col gap-4 px-4 py-4 md:px-6 md:py-6"
        data-testid="transfer-miles-skeleton"
    >
        <div className="flex flex-col gap-2 font-slab">
            <div className={`h-7 w-56 ${pulseClassName}`} />
            <div className={`h-5 w-full ${pulseClassName}`} />
            <div className={`h-5 w-11/12 ${pulseClassName}`} />
        </div>

        <section
            aria-hidden="true"
            className="w-full rounded-lg border border-darkGrayishBlue-300 bg-white p-4"
        >
            <div className={`h-5 w-20 ${pulseClassName}`} />
            <div className={`mt-1 h-5 w-44 ${pulseClassName}`} />
            <div className={`mt-4 h-5 w-28 ${pulseClassName}`} />
            <div className={`mt-1 h-8 w-40 ${pulseClassName}`} />
        </section>

        <div className="flex flex-col gap-2">
            <div className={`h-5 w-48 ${pulseClassName}`} />
            <div className="flex gap-2">
                <div className={`h-10 flex-1 rounded-lg ${pulseClassName}`} />
                <div className={`h-10 w-[88px] rounded-lg ${pulseClassName}`} />
            </div>
        </div>

        <div className={`h-10 w-full rounded-lg ${pulseClassName}`} />
    </main>
)

export default TransferMilesSkeleton
