import { getTranslations } from 'next-intl/server'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/lib/i18n/navigation'
import { Button } from '@/components/ui/button'
import { HeroBackground } from './HeroBackground'

export async function HomeHero() {
  const t = await getTranslations('Home.Hero')

  return (
    <section className="relative overflow-hidden">
      <HeroBackground />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:py-32 md:py-40">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">OrbCharts</h1>
        <p className="mt-4 text-xl font-medium sm:text-2xl">{t('subtitle')}</p>
        <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
          {t('description')}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="bg-brand text-brand-foreground hover:bg-brand/90">
            <Link href="/docs/getting-started/installation">
              {t('ctaStart')}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/demo">{t('ctaDemo')}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
