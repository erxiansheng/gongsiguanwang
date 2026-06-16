"use client"

import { useEffect } from 'react'
import { apiUrl } from '@/lib/api-config'

const VISITOR_ID_KEY = 'jkyc_visitor_id'

function getVisitorId() {
  let visitorId = window.localStorage.getItem(VISITOR_ID_KEY)
  if (!visitorId) {
    visitorId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
    window.localStorage.setItem(VISITOR_ID_KEY, visitorId)
  }
  return visitorId
}

export default function VisitTracker() {
  useEffect(() => {
    if (window.location.pathname.startsWith('/admin')) return

    const today = new Date().toISOString().slice(0, 10)
    const pageKey = `jkyc_tracked_${today}_${window.location.pathname}`
    if (window.sessionStorage.getItem(pageKey)) return
    window.sessionStorage.setItem(pageKey, '1')

    const payload = {
      visitorId: getVisitorId(),
      path: window.location.pathname,
      referrer: document.referrer,
      userAgent: navigator.userAgent
    }

    const body = JSON.stringify(payload)
    const url = apiUrl('/visit')

    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' })
      if (navigator.sendBeacon(url, blob)) return
    }

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true
    }).catch(() => undefined)
  }, [])

  return null
}
