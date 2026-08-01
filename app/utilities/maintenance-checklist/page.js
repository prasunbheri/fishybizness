'use client'

import { useEffect, useState } from 'react'
import { UtilityHeader, Note } from '@/components/utilityUi'
import { maintenanceGroups } from '@/lib/maintenanceData'

const STORAGE_KEY = 'fishybizness-maintenance'

export default function MaintenanceChecklistPage() {
  const [checked, setChecked] = useState({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setChecked(JSON.parse(raw))
    } catch {
      // ignore corrupt storage
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checked))
    } catch {
      // ignore quota errors
    }
  }, [checked, loaded])

  const allTasks = maintenanceGroups.flatMap(g => g.tasks)
  const doneCount = allTasks.filter(t => checked[t.id]).length
  const pct = allTasks.length > 0 ? Math.round((doneCount / allTasks.length) * 100) : 0

  function toggle(id) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function reset() {
    setChecked({})
  }

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <UtilityHeader
        title="Maintenance Checklist"
        desc="A complete aquarium care routine, grouped by how often things need doing. Tap items to tick them off — your progress is saved on this device."
      />

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-zinc-800 dark:text-white">
            {doneCount} of {allTasks.length} tasks done
          </p>
          <button
            type="button"
            onClick={reset}
            className="text-xs text-zinc-400 hover:text-red-500 transition-colors"
          >
            Reset all
          </button>
        </div>
        <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-green-500 transition-all duration-300"
            style={{ width: `${pct}%` }}
          ></div>
        </div>
      </div>

      {maintenanceGroups.map((group, gi) => {
        const groupTasks = group.tasks
        const groupDone = groupTasks.filter(t => checked[t.id]).length
        return (
          <div key={group.id} className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-lg font-semibold text-zinc-800 dark:text-white">{group.label}</h2>
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${group.color}`}></span>
              <span className="text-xs text-zinc-400">
                {groupDone}/{groupTasks.length}
              </span>
            </div>
            <div className="space-y-2">
              {groupTasks.map(task => {
                const on = !!checked[task.id]
                return (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => toggle(task.id)}
                    className={`w-full flex items-start gap-3 text-left px-4 py-3 rounded-xl border transition-all ${
                      on
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-cyan-400'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex items-center justify-center w-5 h-5 rounded-full border text-white text-xs shrink-0 transition-colors ${
                        on
                          ? 'bg-green-500 border-green-500'
                          : 'border-zinc-400 dark:border-zinc-500 text-transparent'
                      }`}
                    >
                      ✓
                    </span>
                    <span
                      className={`text-sm ${
                        on
                          ? 'text-zinc-400 line-through'
                          : 'text-zinc-700 dark:text-zinc-200'
                      }`}
                    >
                      {task.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      <Note>
        Tip: always match the temperature when changing water, dechlorinate first, and rinse filter media in old tank water — never tap water — to protect the beneficial bacteria.
      </Note>
    </div>
  )
}
