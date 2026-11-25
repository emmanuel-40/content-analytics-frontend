import useEmblaCarousel from 'embla-carousel-react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { AnalysisMockup, BillingMockup, DashboardMockup } from './ProductMockups'

const slides = [
  {
    title: 'One clear view of every document',
    description: 'Upload, track and organise everything in a single dark-mode workspace built for focus.',
    mockup: DashboardMockup,
  },
  {
    title: 'AI insight, not just word counts',
    description: 'Summaries, key topics and sentiment land beside your file the moment analysis finishes.',
    mockup: AnalysisMockup,
  },
  {
    title: 'Credits that match your pace',
    description: 'Start free, top up only when you need more, and see every movement in a clean ledger.',
    mockup: BillingMockup,
  },
]

export function ProductCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 28 })
  const [selected, setSelected] = useState(0)
  const [paused, setPaused] = useState(false)

  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap())
    onSelect()
    emblaApi.on('select', onSelect)
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi])

  useEffect(() => {
    if (paused || !emblaApi) return
    const id = window.setInterval(() => emblaApi.scrollNext(), 5200)
    return () => window.clearInterval(id)
  }, [emblaApi, paused])

  return (
    <div
      className="relative mx-auto w-full max-w-5xl overflow-x-clip"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute -inset-x-10 -top-10 h-64 rounded-full bg-signal-500/10 blur-[100px]" />
      <div className="relative overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map(({ title, description, mockup: Mockup }) => (
            <div key={title} className="min-w-0 flex-[0_0_100%] px-2">
              <div className="mx-auto max-w-3xl">
                <Mockup />
                <div className="mt-5 text-center">
                  <h3 className="text-base font-semibold text-zinc-100 sm:text-lg">{title}</h3>
                  <p className="mx-auto mt-1.5 max-w-xl text-sm text-zinc-500">{description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-5">
        <button
          onClick={scrollPrev}
          aria-label="Previous slide"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-600 text-zinc-400 transition hover:border-signal-400 hover:text-signal-300"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.title}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                index === selected ? 'w-7 bg-signal-400' : 'w-1.5 bg-ink-600 hover:bg-ink-500',
              )}
            />
          ))}
        </div>
        <button
          onClick={scrollNext}
          aria-label="Next slide"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-600 text-zinc-400 transition hover:border-signal-400 hover:text-signal-300"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
