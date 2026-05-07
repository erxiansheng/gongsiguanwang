"use client"

import Image from 'next/image'
import { MessageCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { SocialLink } from '@/lib/site-content'
import { cn } from '@/lib/utils'

interface SocialQrButtonProps {
  link: SocialLink
  className?: string
  iconClassName?: string
}

export default function SocialQrButton({ link, className, iconClassName }: SocialQrButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            'inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted',
            className
          )}
          aria-label={link.name}
        >
          <SocialIcon icon={link.icon} name={link.name} className={iconClassName} />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle>{link.name}</DialogTitle>
        </DialogHeader>
        {link.qrCode ? (
          <div className="relative mx-auto aspect-square w-full max-w-[240px] overflow-hidden rounded-md border border-border bg-white">
            <Image
              src={link.qrCode}
              alt={`${link.name}二维码`}
              fill
              sizes="240px"
              className="object-contain p-2"
              unoptimized
            />
          </div>
        ) : (
          <div className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
            二维码图片暂未配置
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function SocialIcon({ icon, name, className }: { icon?: string; name: string; className?: string }) {
  if (icon === 'wechat') return <WechatIcon className={className} />
  if (icon === 'qq') return <QqIcon className={className} />
  return <MessageCircle className={cn('h-5 w-5', className)} aria-hidden="true" />
}

function WechatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('h-5 w-5', className)} aria-hidden="true">
      <path fill="currentColor" d="M9.4 5.3C5.8 5.3 3 7.6 3 10.5c0 1.6.8 3 2.1 4l-.5 1.7 2-.9c.8.3 1.7.5 2.7.5 3.6 0 6.4-2.3 6.4-5.2S13 5.3 9.4 5.3Zm-2.1 4.4a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6Zm4.1 0a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6Z" />
      <path fill="currentColor" d="M21 13.6c0-2.4-2.3-4.4-5.2-4.6.1.5.2 1 .2 1.5 0 3.4-3.1 6.1-7.1 6.4.9 1 2.3 1.6 3.9 1.6.8 0 1.5-.1 2.1-.4l1.7.8-.4-1.4c1.1-.9 1.8-2.2 1.8-3.9Zm-6.9-.7a.7.7 0 1 1 0-1.4.7.7 0 0 1 0 1.4Zm3.2 0a.7.7 0 1 1 0-1.4.7.7 0 0 1 0 1.4Z" />
    </svg>
  )
}

function QqIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('h-5 w-5', className)} aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.16" />
      <text x="12" y="15" textAnchor="middle" fontSize="8" fontWeight="700" fill="currentColor">QQ</text>
    </svg>
  )
}