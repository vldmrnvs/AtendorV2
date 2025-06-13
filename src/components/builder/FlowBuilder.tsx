'use client'

import React, { useEffect } from 'react'
import ReactFlow, {
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
} from 'reactflow'
import { useFlowStore } from '@/store/flow-store'
import { supabase } from '@/utils/supabase'
import 'reactflow/dist/style.css'

export default function FlowBuilder({ botId }: { botId: string }) {
  const { nodes, edges, setNodes, setEdges } = useFlowStore()

  useEffect(() => {
    async function loadFlow() {
      const { data } = await supabase
        .from('bot_flows')
        .select('nodes, edges')
        .eq('bot_id', botId)
        .single()

      if (data) {
        setNodes(data.nodes || [])
        setEdges(data.edges || [])
      }
    }
    loadFlow()
  }, [botId, setEdges, setNodes])

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={(changes: NodeChange[]) => {
          const updated = applyNodeChanges(changes, nodes)
          setNodes(updated)
          supabase.from('bot_flows').upsert({ bot_id: botId, nodes: updated, edges })
        }}
        onEdgesChange={(changes: EdgeChange[]) => {
          const updated = applyEdgeChanges(changes, edges)
          setEdges(updated)
          supabase.from('bot_flows').upsert({ bot_id: botId, nodes, edges: updated })
        }}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}
