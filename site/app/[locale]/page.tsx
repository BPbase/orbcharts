import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { HomeHero } from '@/components/home/HomeHero'
import { FeatureSection } from '@/components/home/FeatureSection'
import { QuickDemoSection } from '@/components/home/QuickDemoSection'
import { CtaSection } from '@/components/home/CtaSection'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Home' })
  return {
    title: t('title'),
    description: `${t('subtitle')} — ${t('description')}`,
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'OrbCharts',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    url: 'https://bpbase.github.io/orbcharts',
    softwareVersion: '4.0.0-beta.1',
    offers: { '@type': 'Offer', price: '0' },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeHero />
      <FeatureSection />
      <QuickDemoSection />
      <CtaSection />
    </>
  )
}
