import { getTranslations } from 'next-intl/server'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/lib/i18n/navigation'
import { Button } from '@/components/ui/button'
import { CopyButton } from './CopyButton'
import { Reveal } from './Reveal'

/** 與文件「安裝」頁一致的安裝指令 */
const INSTALL_COMMAND = 'npm i orbcharts'

export async function CtaSection() {
  const t = await getTranslations('Home.Cta')

  return (
    <section aria-labelledby="cta-heading" className="border-t">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center sm:py-28">
        <Reveal className="flex w-full flex-col items-center">
          <h2 id="cta-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('heading')}
          </h2>
          <p className="mt-4 text-muted-foreground">{t('description')}</p>
          <div className="mt-8 flex w-full max-w-md items-center justify-between gap-2 rounded-lg border bg-muted/50 py-2 pl-4 pr-2 font-mono text-sm">
            <code className="overflow-x-auto whitespace-nowrap">{INSTALL_COMMAND}</code>
            <CopyButton text={INSTALL_COMMAND} label={t('copy')} copiedLabel={t('copied')} />
          </div>
          <Button asChild variant="link" className="mt-6 text-brand">
            <Link href="/docs">
              {t('ctaDocs')}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
