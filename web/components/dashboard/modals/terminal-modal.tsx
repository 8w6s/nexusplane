'use client'

import { useState } from 'react'
import { X, Maximize2, Send } from 'lucide-react'

interface TerminalModalProps {
  nodeId: string
  onClose: () => void
}

export function TerminalModal({ nodeId, onClose }: TerminalModalProps) {
  const [input, setInput] = useState('')
  const [terminal, setTerminal] = useState([
    '$ ssh root@node-vn-01',
    'Welcome to Orchestrator - Cloud Infrastructure Console',
    'Last login: 2024-04-06 20:45:32 UTC',
    '',
    'node-vn-01:~#',
  ])

  const commands: Record<string, string[]> = {
    'uptime': [
      ' 20:45:45 up 45 days, 12:30,  1 user,  load average: 0.42, 0.38, 0.35',
      '',
      'node-vn-01:~#',
    ],
    'df -h': [
      'Filesystem      Size  Used Avail Use% Mounted on',
      '/dev/sda1      2.0T  900G  1.1T  45% /',
      '/dev/sdb1      4.0T  2.9T  1.1T  72% /mnt/data',
      '',
      'node-vn-01:~#',
    ],
    'ps aux | grep vm': [
      'root      1234  8.5 24.3 2048000 1024000 ?  Sl   19:30   0:45 /usr/bin/kvm -m 32G ...',
      'root      5678  4.2 16.8 1024000 512000 ?   Sl   19:35   0:22 /usr/bin/kvm -m 16G ...',
      '',
      'node-vn-01:~#',
    ],
    'systemctl status': [
      '● node-vn-01',
      '    State: running',
      '  Uptime: 45 days 12h 30m',
      '',
      'node-vn-01:~#',
    ],
  }

  const handleSubmit = () => {
    if (!input.trim()) return

    const newTerminal = [...terminal]
    newTerminal.pop()
    newTerminal.push(input)

    const command = input.split(' ')[0]
    const response = commands[input] || [
      `bash: ${input}: command not found`,
      'Try: uptime, df -h, ps aux | grep vm, systemctl status',
      '',
      'node-vn-01:~#',
    ]

    setTerminal([...newTerminal, ...response])
    setInput('')
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-950 border border-slate-700 rounded-lg w-full max-w-2xl h-96 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-900">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-sm font-medium text-slate-300">{nodeId} - SSH Terminal</span>
          </div>
          <div className="flex gap-2">
            <button className="p-1 hover:bg-slate-800 rounded transition-colors">
              <Maximize2 className="w-4 h-4 text-slate-400" />
            </button>
            <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded transition-colors">
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Terminal Output */}
        <div className="flex-1 overflow-y-auto p-4 font-mono text-sm text-green-400 bg-black space-y-0.5">
          {terminal.map((line, idx) => (
            <div key={idx} className={line.includes('error') || line.includes('not found') ? 'text-red-400' : ''}>
              {line}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-slate-700 p-4 bg-slate-900 flex gap-2">
          <span className="text-green-400 font-mono text-sm flex-shrink-0">{nodeId}:~# </span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Type command..."
            autoFocus
            className="flex-1 bg-transparent outline-none text-green-400 font-mono text-sm"
          />
          <button
            onClick={handleSubmit}
            className="p-2 hover:bg-slate-800 rounded transition-colors text-green-400"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
