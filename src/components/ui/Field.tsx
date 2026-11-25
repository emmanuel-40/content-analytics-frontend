import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface FieldProps {
  label: string
  error?: string
  hint?: string
  children: ReactNode
  className?: string
}

export function Field({ label, error, hint, children, className }: FieldProps) {
  return (
    <div className={className}>
      <label className="label">{label}</label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-red-400">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-zinc-400">{hint}</p>
      ) : null}
    </div>
  )
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }
export function Input({ className, invalid, ...props }: InputProps) {
  return <input className={cn('field', invalid && 'field-error', className)} {...props} />
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }
export function Select({ className, invalid, children, ...props }: SelectProps) {
  return (
    <select className={cn('field', invalid && 'field-error', className)} {...props}>
      {children}
    </select>
  )
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }
export function Textarea({ className, invalid, ...props }: TextareaProps) {
  return <textarea className={cn('field', invalid && 'field-error', className)} {...props} />
}
