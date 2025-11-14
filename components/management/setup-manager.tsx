"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Plus, Trash2, Edit } from 'lucide-react'
import { Database } from '@/lib/supabase/database.types'
import { createClient } from '@/lib/supabase/client'

type Setup = Database['public']['Tables']['setups']['Row']

interface SetupManagerProps {
  initialSetups: Setup[]
}

const PRESET_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
]

export function SetupManager({ initialSetups }: SetupManagerProps) {
  const [setups, setSetups] = useState<Setup[]>(initialSetups)
  const [isOpen, setIsOpen] = useState(false)
  const [editingSetup, setEditingSetup] = useState<Setup | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState(PRESET_COLORS[0])
  const [isLoading, setIsLoading] = useState(false)

  const supabase = createClient()

  const resetForm = () => {
    setName('')
    setDescription('')
    setColor(PRESET_COLORS[0])
    setEditingSetup(null)
  }

  const handleCreate = async () => {
    if (!name.trim()) return

    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('setups')
        .insert({
          user_id: user.id,
          name: name.trim(),
          description: description.trim() || null,
          color,
        })
        .select()
        .single()

      if (error) throw error

      setSetups([...setups, data])
      setIsOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error creating setup:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingSetup || !name.trim()) return

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('setups')
        .update({
          name: name.trim(),
          description: description.trim() || null,
          color,
        })
        .eq('id', editingSetup.id)
        .select()
        .single()

      if (error) throw error

      setSetups(setups.map(s => s.id === data.id ? data : s))
      setIsOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error updating setup:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this setup?')) return

    try {
      const { error } = await supabase
        .from('setups')
        .delete()
        .eq('id', id)

      if (error) throw error

      setSetups(setups.filter(s => s.id !== id))
    } catch (error) {
      console.error('Error deleting setup:', error)
    }
  }

  const openEditDialog = (setup: Setup) => {
    setEditingSetup(setup)
    setName(setup.name)
    setDescription(setup.description || '')
    setColor(setup.color)
    setIsOpen(true)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsOpen(true)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Trading Setups</CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Setup
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingSetup ? 'Edit Setup' : 'Create New Setup'}
                </DialogTitle>
                <DialogDescription>
                  {editingSetup 
                    ? 'Update your trading setup details'
                    : 'Add a new trading setup to categorize your trades'
                  }
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Setup Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Trend Continuation"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    placeholder="Describe your setup..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="flex gap-2">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        className="w-8 h-8 rounded-full border-2 transition-all"
                        style={{
                          backgroundColor: c,
                          borderColor: color === c ? 'white' : 'transparent',
                        }}
                        onClick={() => setColor(c)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={editingSetup ? handleUpdate : handleCreate}
                  disabled={isLoading || !name.trim()}
                >
                  {isLoading ? 'Saving...' : (editingSetup ? 'Update' : 'Create')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {setups.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No setups yet. Create your first setup to get started!
            </p>
          ) : (
            setups.map((setup) => (
              <div
                key={setup.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: setup.color }}
                  />
                  <div>
                    <p className="font-medium">{setup.name}</p>
                    {setup.description && (
                      <p className="text-sm text-muted-foreground">{setup.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(setup)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(setup.id)}
                  >
                    <Trash2 className="h-4 w-4 text-loss" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

