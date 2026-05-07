"use client"

import { useMemo, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Image from 'next/image'
import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import SocialQrButton from '@/components/social-qr-button'
import { useSiteContent } from '@/hooks/use-site-content'
import type { SiteContent } from '@/lib/site-content'

type ContactFields = SiteContent['contact']['fields']
type ContactFieldName = 'name' | 'email' | 'phone' | 'company' | 'message'

interface FormValues {
  name: string
  email: string
  phone: string
  company: string
  message: string
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ContactPage() {
  const { content, isLoading } = useSiteContent()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const contact = content.contact
  const formSchema = useMemo(() => createContactFormSchema(contact.fields), [contact.fields])
  const required = useMemo(() => ({
    name: isFieldRequired(contact.fields, 'name'),
    email: isFieldRequired(contact.fields, 'email'),
    phone: isFieldRequired(contact.fields, 'phone'),
    company: isFieldRequired(contact.fields, 'company'),
    message: isFieldRequired(contact.fields, 'message'),
  }), [contact.fields])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      message: '',
    },
  })

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || '提交失败，请稍后再试。')
      setIsSubmitted(true)
      form.reset()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : '提交失败，请稍后再试。')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`pt-24 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
      <section className="py-20 md:py-28">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
              {contact.heroTitle}
            </h1>
            <p className="text-xl text-muted-foreground">
              {contact.heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-card rounded-lg border border-border p-8">
              {isSubmitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Send className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{contact.successTitle}</h3>
                  <p className="text-muted-foreground mb-8 max-w-md">
                    {contact.successMessage}
                  </p>
                  <Button onClick={() => setIsSubmitted(false)}>
                    {contact.sendAnotherLabel}
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-6">{contact.formTitle}</h2>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel><RequiredLabel label={contact.fields.name} required={required.name} /></FormLabel>
                              <FormControl>
                                <Input placeholder={contact.fields.namePlaceholder} required={required.name} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel><RequiredLabel label={contact.fields.email} required={required.email} /></FormLabel>
                              <FormControl>
                                <Input type="email" placeholder={contact.fields.emailPlaceholder} required={required.email} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel><RequiredLabel label={contact.fields.phone} required={required.phone} /></FormLabel>
                              <FormControl>
                                <Input placeholder={contact.fields.phonePlaceholder} required={required.phone} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel><RequiredLabel label={contact.fields.company} required={required.company} /></FormLabel>
                              <FormControl>
                                <Input placeholder={contact.fields.companyPlaceholder} required={required.company} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel><RequiredLabel label={contact.fields.message} required={required.message} /></FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={contact.fields.messagePlaceholder}
                                className="min-h-[120px]"
                                required={required.message}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {submitError && <p className="text-sm text-destructive">{submitError}</p>}

                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? contact.submittingLabel : contact.submitLabel}
                      </Button>
                    </form>
                  </Form>
                </>
              )}
            </div>

            <div>
              <div className="bg-muted/30 rounded-lg p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6">{contact.infoTitle}</h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mr-4">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{contact.labels.email}</h3>
                      <a href={`mailto:${contact.info.email}`} className="text-muted-foreground hover:text-foreground transition-colors">
                        {contact.info.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mr-4">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{contact.labels.phone}</h3>
                      <a href={`tel:${contact.info.phone.replace(/\s/g, '')}`} className="text-muted-foreground hover:text-foreground transition-colors">
                        {contact.info.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mr-4">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{contact.labels.address}</h3>
                      <address className="not-italic text-muted-foreground">
                        {contact.info.addressLines.map((line) => <span key={line}>{line}<br /></span>)}
                      </address>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mr-4">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{contact.labels.hours}</h3>
                      <p className="text-muted-foreground">
                        {contact.info.hoursLines.map((line) => <span key={line}>{line}<br /></span>)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-border">
                  <h3 className="font-medium mb-4">{contact.labels.follow}</h3>
                  <div className="flex space-x-4">
                    {contact.info.socialLinks.map((link, index) => (
                      <SocialQrButton key={`${link.name}-${index}`} link={link} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="h-[300px] relative rounded-lg overflow-hidden">
                <Image
                  src={contact.image}
                  alt={contact.infoTitle}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6">
              {contact.faqTitle}
            </h2>
            <p className="text-muted-foreground text-lg">
              {contact.faqSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {contact.faqs.map((faq) => (
              <div key={faq.question} className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-bold mb-3">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function RequiredLabel({ label, required }: { label: string; required: boolean }) {
  return (
    <>
      {label}
      {required && <span className="ml-1 text-destructive">*</span>}
    </>
  )
}

function isFieldRequired(fields: ContactFields, field: ContactFieldName) {
  return fields[`${field}Required` as keyof ContactFields] === true
}

function createContactFormSchema(fields: ContactFields) {
  return z.object({
    name: createTextSchema(fields, 'name', 2, `${fields.name}至少需要 2 个字符。`),
    email: createEmailSchema(fields),
    phone: createTextSchema(fields, 'phone', 1, `请填写${fields.phone}`),
    company: createTextSchema(fields, 'company', 1, `请填写${fields.company}`),
    message: createTextSchema(fields, 'message', 10, `${fields.message}至少需要 10 个字符。`),
  })
}

function createTextSchema(fields: ContactFields, field: ContactFieldName, minLength: number, minMessage: string) {
  const required = isFieldRequired(fields, field)
  const label = fields[field]

  return z.string().trim().superRefine((value, context) => {
    if (required && value.length === 0) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: `请填写${label}` })
      return
    }

    if (value.length > 0 && value.length < minLength) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: minMessage })
    }
  })
}

function createEmailSchema(fields: ContactFields) {
  const required = isFieldRequired(fields, 'email')

  return z.string().trim().superRefine((value, context) => {
    if (required && value.length === 0) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: `请填写${fields.email}` })
      return
    }

    if (value.length > 0 && !emailPattern.test(value)) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: '请输入有效的邮箱地址。' })
    }
  })
}