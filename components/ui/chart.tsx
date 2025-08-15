'use client'

import * as React from 'react'
import * as Recharts from 'recharts'
import type { TooltipProps, LegendProps } from 'recharts'
import { cn } from '@/lib/utils'

// =====================================
// Theme + Config
// =====================================

const THEMES = { light: '', dark: '.dark' } as const

export type ChartConfig = {
  [k: string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = { config: ChartConfig }
const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const ctx = React.useContext(ChartContext)
  if (!ctx) throw new Error('useChart must be used within a <ChartContainer />')
  return ctx
}

// =====================================
// Container + Style
// =====================================

type ChartContainerProps = React.ComponentProps<'div'> & {
  config: ChartConfig
  children: React.ComponentProps<typeof Recharts.ResponsiveContainer>['children']
}

export const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ id, className, children, config, ...props }, ref) => {
    const uniqueId = React.useId()
    const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`

    return (
      <ChartContext.Provider value={{ config }}>
        <div
          data-chart={chartId}
          ref={ref}
          className={cn(
            'flex aspect-video justify-center text-xs',
            "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
            "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50",
            '[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border',
            "[&_.recharts-dot[stroke='#fff']]:stroke-transparent",
            '[&_.recharts-layer]:outline-none',
            "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border",
            '[&_.recharts-radial-bar-background-sector]:fill-muted',
            '[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted',
            "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-border",
            "[&_.recharts-sector[stroke='#fff']]:stroke-transparent",
            '[&_.recharts-sector]:outline-none',
            '[&_.recharts-surface]:outline-none',
            className
          )}
          {...props}
        >
          <ChartStyle id={chartId} config={config} />
          <Recharts.ResponsiveContainer>{children}</Recharts.ResponsiveContainer>
        </div>
      </ChartContext.Provider>
    )
  }
)
ChartContainer.displayName = 'Chart'

export const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([, cfg]) => cfg.theme || cfg.color)
  if (!colorConfig.length) return null

  return (
    <style
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, item]) => {
    const color = item.theme?.[theme as keyof typeof item.theme] ?? item.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .filter(Boolean)
  .join('\n')}
}
`
          )
          .join('\n'),
      }}
    />
  )
}

// =====================================
// Tooltip
// =====================================

export const ChartTooltip = Recharts.Tooltip

type ChartTooltipExtra = {
  hideLabel?: boolean
  hideIndicator?: boolean
  indicator?: 'line' | 'dot' | 'dashed'
  nameKey?: string
  labelKey?: string
  formatter?: (
    value: number,
    name: string,
    item: any,
    index: number,
    payload: any
  ) => React.ReactNode
  labelFormatter?: (value: React.ReactNode, payload?: any) => React.ReactNode
  labelClassName?: string
  color?: string
}

export const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  TooltipProps<number, string> & ChartTooltipExtra & React.ComponentProps<'div'>
>(function ChartTooltipContent(
  {
    active,
    payload,
    label,
    className,
    indicator = 'dot',
    hideLabel = false,
    hideIndicator = false,
    labelFormatter,
    labelClassName,
    formatter,
    color,
    nameKey,
    labelKey,
  },
  ref
) {
  const { config } = useChart()

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) return null
    const [item] = payload
    const key = `${labelKey || (item.dataKey as string) || item.name || 'value'}`
    const itemCfg = getPayloadConfigFromPayload(config, item, key)
    const final =
      !labelKey && typeof label === 'string'
        ? (config[label as keyof typeof config]?.label ?? label)
        : itemCfg?.label

    if (labelFormatter) {
      return <div className={cn('font-medium', labelClassName)}>{labelFormatter(final, payload)}</div>
    }
    return final ? <div className={cn('font-medium', labelClassName)}>{final}</div> : null
  }, [hideLabel, payload, label, labelKey, labelFormatter, labelClassName, config])

  if (!active || !payload?.length) return null
  const nestLabel = payload.length === 1 && indicator !== 'dot'

  return (
    <div
      ref={ref}
      className={cn(
        'grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl',
        className
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const key = `${nameKey || item.name || (item.dataKey as string) || 'value'}`
          const itemCfg = getPayloadConfigFromPayload(config, item, key)
          const indicatorColor = color || (item.payload as any)?.fill || item.color

          return (
            <div
              key={String(item.dataKey ?? item.value) + index}
              className={cn(
                'flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground',
                indicator === 'dot' && 'items-center'
              )}
            >
              {formatter && item.value !== undefined && item.name ? (
                formatter(item.value as number, item.name as string, item, index, item.payload)
              ) : (
                <>
                  {itemCfg?.icon ? (
                    <itemCfg.icon />
                  ) : (
                    !hideIndicator && (
                      <div
                        className={cn(
                          'shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]',
                          {
                            'h-2.5 w-2.5': indicator === 'dot',
                            'w-1': indicator === 'line',
                            'w-0 border-[1.5px] border-dashed bg-transparent':
                              indicator === 'dashed',
                            'my-0.5': nestLabel && indicator === 'dashed',
                          }
                        )}
                        style={
                          {
                            '--color-bg': indicatorColor,
                            '--color-border': indicatorColor,
                          } as React.CSSProperties
                        }
                      />
                    )
                  )}
                  <div
                    className={cn(
                      'flex flex-1 justify-between leading-none',
                      nestLabel ? 'items-end' : 'items-center'
                    )}
                  >
                    <div className="grid gap-1.5">
                      {nestLabel ? tooltipLabel : null}
                      <span className="text-muted-foreground">
                        {itemCfg?.label || item.name}
                      </span>
                    </div>
                    {item.value !== undefined && (
                      <span className="font-mono font-medium tabular-nums text-foreground">
                        {(item.value as number).toLocaleString()}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
})
ChartTooltipContent.displayName = 'ChartTooltip'

// =====================================
// Legend
// =====================================

export const ChartLegend = Recharts.Legend

export const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> &
    Pick<LegendProps, 'payload' | 'verticalAlign'> & { hideIcon?: boolean; nameKey?: string }
>(function ChartLegendContent(
  { className, hideIcon = false, payload, verticalAlign = 'bottom', nameKey },
  ref
) {
  const { config } = useChart()
  if (!payload?.length) return null

  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-center gap-4',
        verticalAlign === 'top' ? 'pb-3' : 'pt-3',
        className
      )}
    >
      {payload.map((item) => {
        const key = `${nameKey || (item.dataKey as string) || 'value'}`
        const itemCfg = getPayloadConfigFromPayload(config, item, key)

        return (
          <div
            key={String(item.value)}
            className="flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
          >
            {itemCfg?.icon && !hideIcon ? (
              <itemCfg.icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: item.color as string }}
              />
            )}
            {itemCfg?.label}
          </div>
        )
      })}
    </div>
  )
})
ChartLegendContent.displayName = 'ChartLegend'

// =====================================
// Helpers
// =====================================

function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== 'object' || payload === null) return undefined

  const inner =
    'payload' in payload && typeof (payload as any).payload === 'object'
      ? (payload as any).payload
      : undefined

  let configKey = key

  if (key in (payload as any) && typeof (payload as any)[key] === 'string') {
    configKey = (payload as any)[key]
  } else if (inner && key in inner && typeof inner[key] === 'string') {
    configKey = inner[key]
  }

  return configKey in config ? config[configKey] : (config as any)[key]
}

export {
  // alias bila ada import lama
  ChartTooltip as Tooltip,
  ChartLegend as Legend,
}
