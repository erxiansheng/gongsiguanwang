"use client"

import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
          <DialogDescription className="sr-only">{link.name}二维码</DialogDescription>
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
  const src = icon === 'wechat' ? '/images/weixin.png' : icon === 'qq' ? '/images/qq.png' : ''

  if (!src) return <span className={cn('text-xs font-medium', className)}>{name.slice(0, 2)}</span>

  return <Image src={src} alt="" width={24} height={24} className={cn('h-6 w-6 object-contain', className)} />
}