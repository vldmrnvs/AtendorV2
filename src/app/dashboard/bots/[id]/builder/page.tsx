'use client'

import React from 'react'
import FlowBuilder from '@/components/builder/FlowBuilder'
import { useParams } from 'next/navigation'

export default function BuilderPage() {
  const params = useParams<{ id: string }>()
  return <FlowBuilder botId={params.id} />
}
