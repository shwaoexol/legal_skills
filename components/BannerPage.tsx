

export function BannerPage({ title, subtitle}: { title: string; subtitle?: string}){
    return (
        <section className="bg-navy-900">
            <div className="mx-auto max-w-6xl px-6 py-10">
                <h1 className="text-2xl font-semibold text-white">{title}</h1>
                {subtitle && <p className="mt-2 text-white/70">{subtitle}</p>}
            </div>
        </section>
    )
}