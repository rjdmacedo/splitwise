import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger
} from '@/components/ui/multi-select'
import { useEffect, useState } from 'react'
import { User } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useAuth } from '@clerk/nextjs'

export function AddExpenseButton() {
  const { userId } = useAuth()
  const [open, setOpen] = useState(false)

  const { data: me } = useQuery<User>({
    enabled: open,
    queryKey: ['me', userId],
    queryFn: async () => {
      const res = await fetch('/api/me')
      return res.json()
    }
  })
  const { data: friends = [], isLoading } = useQuery<User[]>({
    enabled: open,
    queryKey: ['friends'],
    queryFn: async () => {
      const res = await fetch('/api/friends')
      return res.json()
    }
  })

  const [paidBy, setPaidBy] = useState<User>()
  const [selected, setSelected] = useState<User[]>([])

  useEffect(() => {
    if (me) {
      setPaidBy(me)
    }
  }, [me])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Add an expense</Button>
      </DialogTrigger>
      <DialogContent className="gap-6 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add an expense</DialogTitle>
          <DialogDescription>Add an expense to your account.</DialogDescription>
        </DialogHeader>
        <MultiSelector
          loop
          values={selected.map(getUserFriendlyName)}
          className="max-w-md"
          onValuesChange={values => {
            setSelected(() =>
              friends.filter(friend =>
                values.includes(getUserFriendlyName(friend))
              )
            )
          }}
        >
          <MultiSelectorTrigger>
            <MultiSelectorInput
              disabled={isLoading}
              placeholder="With you and:"
              className={cn('w-full', {
                'opacity-50': isLoading
              })}
            />
          </MultiSelectorTrigger>
          <MultiSelectorContent>
            <MultiSelectorList>
              {friends.map(user => (
                <MultiSelectorItem
                  key={user.id}
                  value={getUserFriendlyName(user)}
                >
                  {getUserFriendlyName(user)}
                </MultiSelectorItem>
              ))}
            </MultiSelectorList>
          </MultiSelectorContent>
        </MultiSelector>
        <Separator />
        {/* Amount */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            min={0}
            step={0.01}
            pattern={'^\\d+(\\.\\d{1,2})?$'}
          />
        </div>
        {/* Description */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="description">Description</Label>
          <Input id="description" name="description" type="text" />
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-center gap-2">
            <p>Paid by</p>
            <Select defaultValue={paidBy?.id}>
              <SelectTrigger disabled={isLoading} className={cn('w-40')}>
                <SelectValue placeholder="paid by" />
              </SelectTrigger>
              <SelectContent>
                {[...(paidBy ? [paidBy] : []), ...friends].map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {`${getUserFriendlyName(user)} ${user.id === userId ? '(you)' : ''}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-center gap-2">
            <p>and split</p>
            <Select defaultValue="equally">
              <SelectTrigger disabled={isLoading} className={cn('w-40')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equally">Equally</SelectItem>
                <SelectItem value="exact-amounts">By exact amounts</SelectItem>
                <SelectItem value="percentages">By percentages</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <pre>{JSON.stringify(selected, null, 2)}</pre>
      </DialogContent>
    </Dialog>
  )
}

function getUserFriendlyName(user: User | undefined) {
  let name = ''
  if (user?.firstName && user?.lastName) {
    name = `${user.firstName} ${user.lastName}`
  } else if (user?.firstName) {
    name = user.firstName
  } else if (user?.lastName) {
    name = user.lastName
  } else if (user?.username) {
    name = user.username
  }
  return name
}
