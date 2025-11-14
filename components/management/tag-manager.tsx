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

type Tag = Database['public']['Tables']['tags']['Row']

interface TagManagerProps {
  initialTags: Tag[]
}

const PRESET_COLORS = [
  '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
]

export function TagManager({ initialTags }: TagManagerProps) {
  const [tags, setTags] = useState<Tag[]>(initialTags)
  const [isOpen, setIsOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [name, setName] = useState('')
  const [color, setColor] = useState(PRESET_COLORS[0])
  const [isLoading, setIsLoading] = useState(false)

  const supabase = createClient()

  const resetForm = () => {
    setName('')
    setColor(PRESET_COLORS[0])
    setEditingTag(null)
  }

  const handleCreate = async () => {
    if (!name.trim()) return

    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('tags')
        .insert({
          user_id: user.id,
          name: name.trim(),
          color,
        })
        .select()
        .single()

      if (error) throw error

      setTags([...tags, data])
      setIsOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error creating tag:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingTag || !name.trim()) return

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('tags')
        .update({
          name: name.trim(),
          color,
        })
        .eq('id', editingTag.id)
        .select()
        .single()

      if (error) throw error

      setTags(tags.map(t => t.id === data.id ? data : t))
      setIsOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error updating tag:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tag?')) return

    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTags(tags.filter(t => t.id !== id))
    } catch (error) {
      console.error('Error deleting tag:', error)
    }
  }

  const openEditDialog = (tag: Tag) => {
    setEditingTag(tag)
    setName(tag.name)
    setColor(tag.color)
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
          <CardTitle>Trade Tags</CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Tag
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingTag ? 'Edit Tag' : 'Create New Tag'}
                </DialogTitle>
                <DialogDescription>
                  {editingTag 
                    ? 'Update your tag details'
                    : 'Add a new tag to label your trades'
                  }
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tag-name">Tag Name</Label>
                  <Input
                    id="tag-name"
                    placeholder="e.g., Followed Plan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                  onClick={editingTag ? handleUpdate : handleCreate}
                  disabled={isLoading || !name.trim()}
                >
                  {isLoading ? 'Saving...' : (editingTag ? 'Update' : 'Create')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {tags.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 w-full">
              No tags yet. Create your first tag to label your trades!
            </p>
          ) : (
            tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
                <span className="font-medium">{tag.name}</span>
                <div className="flex space-x-1 ml-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => openEditDialog(tag)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleDelete(tag.id)}
                  >
                    <Trash2 className="h-3 w-3 text-loss" />
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

