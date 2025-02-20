'use client'

import { Laptop, Moon, Sun, SunMoon } from 'lucide-react'
import { useTheme } from 'next-themes'

import {
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu'

import useMounted from '@/hooks/use-mounted'

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()

  const mounted = useMounted()
  if (!mounted) return null

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <SunMoon />
        Theme
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuCheckboxItem
            checked={resolvedTheme === 'light'}
            onClick={() => setTheme('light')}
          >
            <Sun />
            Light
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={resolvedTheme === 'dark'}
            onClick={() => setTheme('dark')}
          >
            <Moon />
            Dark
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={resolvedTheme === 'system'}
            onClick={() => setTheme('system')}
          >
            <Laptop />
            System
          </DropdownMenuCheckboxItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}
