import { Activity, Database, HardDrive, MemoryStick } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/layout/AppShell'
import { Badge, PageLoader } from '@/components/ui/Feedback'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Select } from '@/components/ui/Field'
import { useHealth, useHealthHistory } from '@/hooks/useHealth'
import { formatDate } from '@/lib/utils'

export function HealthPage() {
  const { data: health, isLoading } = useHealth()
  const [checkType, setCheckType] = useState('database')
  const { data: history } = useHealthHistory(checkType)

  if (isLoading && !health) return <PageLoader label="Checking system health…" />

  const resources = health?.resources
  const resourceCards = [
    { label: 'CPU', value: resources?.cpuUsagePercent, icon: Activity, suffix: '%' },
    { label: 'Memory', value: resources?.memoryUsagePercent, icon: MemoryStick, suffix: '%' },
    { label: 'Disk free', value: resources?.diskAvailableGb, icon: HardDrive, suffix: ' GB' },
  ]

  return (
    <>
      <PageHeader title="Health metrics" description="Live status of the backend and its dependencies." />

      <Card className="mb-6 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Overall status</p>
            <p className="mt-1 font-display text-3xl font-bold text-zinc-50">{health?.status ?? 'N/A'}</p>
          </div>
          <Badge tone={health?.status === 'UP' ? 'success' : health?.status === 'DEGRADED' ? 'warning' : 'danger'}>
            {health?.environment ?? 'runtime'}
          </Badge>
        </div>
        {health?.timestamp && <p className="mt-3 text-xs text-zinc-600">Checked {formatDate(health.timestamp)}</p>}
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        {resourceCards.map(({ label, value, icon: Icon, suffix }) => (
          <Card key={label} className="p-5">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-500">
              {label} <Icon className="h-4 w-4 text-signal-400" />
            </div>
            <p className="mt-3 font-display text-2xl font-bold text-zinc-50">
              {value === undefined ? 'N/A' : typeof value === 'number' ? `${Math.round(value)}${suffix}` : value}
            </p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Components</CardTitle></CardHeader>
          <CardContent className="p-0">
            {!health?.components || Object.keys(health.components).length === 0 ? (
              <p className="p-5 text-sm text-zinc-500">No component data available.</p>
            ) : (
              <ul className="divide-y divide-ink-800">
                {Object.entries(health.components).map(([name, component]) => (
                  <li key={name} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Database className="h-3.5 w-3.5 text-zinc-600" />
                      <span className="text-sm capitalize text-zinc-200">{name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {component.responseTimeMs != null && (
                        <span className="text-xs text-zinc-600">{component.responseTimeMs} ms</span>
                      )}
                      <Badge tone={component.status === 'UP' || component.status === 'HEALTHY' ? 'success' : 'danger'}>
                        {component.status}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between gap-3">
            <CardTitle>History</CardTitle>
            <Select value={checkType} onChange={(event) => setCheckType(event.target.value)} className="w-36">
              {['database', 'redis', 'disk', 'memory', 'api'].map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </Select>
          </CardHeader>
          <CardContent>
            {!history?.length ? (
              <p className="text-sm text-zinc-500">No history recorded yet.</p>
            ) : (
              <div className="flex h-40 items-end gap-1">
                {history.slice(-30).map((metric) => {
                  const healthy = metric.status === 'HEALTHY'
                  return (
                    <div
                      key={metric.id}
                      title={`${metric.status} · ${formatDate(metric.createdAt)}`}
                      className={`min-w-1 flex-1 rounded-t ${healthy ? 'bg-signal-400/70' : 'bg-red-400/70'}`}
                      style={{ height: `${Math.max(8, Math.min(100, metric.responseTimeMs ?? 20))}%` }}
                    />
                  )
                })}
              </div>
            )}
            <p className="mt-3 text-xs text-zinc-600">Last 7 days · height shows response time</p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
