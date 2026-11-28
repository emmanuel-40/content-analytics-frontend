import { Check, CreditCard, Sparkles } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { PageHeader } from '@/components/layout/AppShell'
import { Badge, PageLoader } from '@/components/ui/Feedback'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import {
  useCreditTransactions,
  useInitializePayment,
  usePaymentHistory,
  usePaymentStatus,
  useSubscription,
  useTiers,
  useVerifyPayment,
} from '@/hooks/useBilling'
import { ApiError } from '@/lib/api'
import { formatDate, usd } from '@/lib/utils'

const PACK_COPY: Record<number, string> = {
  10: 'A quick trial for a few files.',
  50: 'For regular research sessions.',
  120: 'Best value for heavy analysis.',
}

export function BillingPage() {
  const { data: subscription, isLoading } = useSubscription()
  const { data: status } = usePaymentStatus()
  const { data: transactions } = useCreditTransactions()
  const { data: payments } = usePaymentHistory()
  const { data: tiers } = useTiers()
  const initialize = useInitializePayment()
  const verify = useVerifyPayment()
  const [params, setParams] = useSearchParams()
  const reference = params.get('reference')
  const verified = useRef(false)

  useEffect(() => {
    if (!reference || verified.current) return
    verified.current = true
    verify.mutate(reference, {
      onSuccess: (payment) => {
        if (payment.status === 'SUCCESS') toast.success('Payment confirmed. Credits added')
        else toast.info(`Payment is ${payment.status.toLowerCase()}`)
        setParams({}, { replace: true })
      },
      onError: () => {
        toast.error('Could not confirm that payment yet')
        setParams({}, { replace: true })
      },
    })
  }, [reference, verify, setParams])

  if (isLoading || verify.isPending) return <PageLoader label="Loading billing details…" />

  const packs = status?.packs
    ? Object.entries(status.packs).map(([credits, cents]) => ({ credits: Number(credits), cents }))
    : []

  return (
    <>
      <PageHeader title="Credits & billing" description="Top up your balance and review every transaction." />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="surface-hover p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500"><Sparkles className="h-4 w-4 text-signal-400" /> Available</div>
          <p className="mt-3 font-display text-4xl font-bold text-signal-300">{subscription?.availableCredits ?? 'N/A'}</p>
          <p className="mt-1 text-xs text-zinc-500">Credits ready to use</p>
        </Card>
        <Card className="p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Current tier</div>
          <p className="mt-3 font-display text-2xl font-bold text-zinc-50">{subscription?.tier ?? 'N/A'}</p>
          <p className="mt-1 text-xs text-zinc-500">
            {subscription?.monthlyCreditAllowance ?? 0} monthly · {subscription?.creditsUsedThisPeriod ?? 0} used
          </p>
        </Card>
        <Card className="p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Purchased</div>
          <p className="mt-3 font-display text-2xl font-bold text-zinc-50">{subscription?.purchasedCredits ?? 0}</p>
          <p className="mt-1 text-xs text-zinc-500">Credits that survive monthly reset</p>
        </Card>
      </div>

      <h2 className="mt-10 text-lg font-semibold text-zinc-100">Buy credits</h2>
      {!status?.configured ? (
        <p className="mt-4 rounded-xl border border-amber-500/25 bg-amber-500/5 p-4 text-sm text-amber-200">
          Payments are not configured on this deployment yet. Contact the administrator.
        </p>
      ) : (
        <>
          {status?.testMode && (
            <p className="mt-4 rounded-xl border border-signal-500/25 bg-signal-400/5 px-4 py-3 text-sm text-zinc-300">
              <span className="font-semibold text-signal-300">Sandbox mode.</span> Use Paystack’s test card{' '}
              <span className="font-mono text-zinc-100">4084 0840 8408 4081</span> (any future expiry and CVC).{' '}
              No real money is charged.
            </p>
          )}
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {packs.map(({ credits, cents }) => (
              <Card key={credits} className="surface-hover flex flex-col p-5">
                <p className="text-sm font-semibold text-zinc-100">{credits} credits</p>
                <p className="mt-1 text-xs text-zinc-500">{PACK_COPY[credits] ?? 'Analysis credits'}</p>
                <p className="mt-5 font-display text-3xl font-bold text-zinc-50">{usd(cents)}</p>
                <Button
                  className="mt-5 w-full"
                  loading={initialize.isPending}
                  onClick={() =>
                    initialize.mutate(credits, {
                      onSuccess: (result) => window.location.assign(result.checkoutUrl),
                      onError: (error) =>
                        toast.error(error instanceof ApiError ? error.message : 'Could not start checkout'),
                    })
                  }
                >
                  <CreditCard className="h-4 w-4" /> Buy now
                </Button>
              </Card>
            ))}
          </div>
        </>
      )}

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Credit ledger</CardTitle></CardHeader>
          <CardContent className="p-0">
            {!transactions?.length ? (
              <p className="p-5 text-sm text-zinc-500">No credit activity yet.</p>
            ) : (
              <ul className="divide-y divide-ink-800">
                {transactions.slice(0, 12).map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div>
                      <p className="text-sm text-zinc-200">{item.description ?? item.type}</p>
                      <p className="text-xs text-zinc-600">{formatDate(item.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${item.amount > 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                        {item.amount > 0 ? '+' : ''}{item.amount}
                      </p>
                      <p className="text-xs text-zinc-600">{item.balanceAfter} left</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Payment history</CardTitle></CardHeader>
          <CardContent className="p-0">
            {!payments?.length ? (
              <p className="p-5 text-sm text-zinc-500">No payments yet.</p>
            ) : (
              <ul className="divide-y divide-ink-800">
                {payments.map((payment) => (
                  <li key={payment.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div>
                      <p className="text-sm text-zinc-200">{payment.credits} credits · {usd(payment.amountCents)}</p>
                      <p className="font-mono text-[11px] text-zinc-600">{payment.reference}</p>
                    </div>
                    <Badge tone={payment.status === 'SUCCESS' ? 'success' : payment.status === 'FAILED' ? 'danger' : 'warning'}>
                      {payment.status.toLowerCase()}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {tiers && tiers.length > 0 && (
        <Card className="mt-6 p-5">
          <h3 className="text-sm font-semibold text-zinc-200">Subscription tiers</h3>
          <div className="mt-3 flex flex-wrap gap-3">
            {tiers.map((tier) => (
              <span key={tier.tier} className="chip">
                <Check className="h-3 w-3 text-signal-400" /> {tier.label} · {tier.monthlyCredits}/mo
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs text-zinc-600">Tier changes are managed by an administrator.</p>
        </Card>
      )}
    </>
  )
}
