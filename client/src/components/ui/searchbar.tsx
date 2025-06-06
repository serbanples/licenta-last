import * as React from "react"
import { Search } from "lucide-react"
import { useDebounce, useSearch } from "@/hooks"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Suggestion } from "@/data-types/general"

interface SearchBarProps {
  placeholder?: string
  debounceTime?: number
}

export function SearchBar({
  placeholder = "Search...",
  debounceTime = 300
}: SearchBarProps) {
  const {
    suggestions,
    setSearchTerm,
    setSuggestTerm,
    wasReset,
  } = useSearch()

  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null)
  const { debouncedCallback: debouncedSetSuggestTerm, cleanup } = useDebounce(setSuggestTerm, debounceTime)

  const handleSelect = (suggestion: Suggestion) => {
    setValue(suggestion.label)
    setSearchTerm(suggestion.label)
    setOpen(false)
  }

  // Stop Radix from auto‐focusing the popover content
  const handlePreventFocusSteal = (e: Event) => {
    e.preventDefault()
    inputRef.current?.focus()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.trim()
    setValue(newValue)
    setOpen(!!newValue)
    debouncedSetSuggestTerm(newValue)
  }

  const handleInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key === "Enter" && value) {
      setSearchTerm(value)
      setOpen(false)
    }
    else if (e.key === "ArrowDown" && suggestions.length > 0) {
      e.preventDefault()
      setOpen(true)
      // Wait a tick for the popover to render, then focus first item
      setTimeout(() => {
        const first = contentRef.current?.querySelector<HTMLElement>(
          '[role="option"]'
        )
        first?.focus()
      }, 0)
    }
  }

  // React.useEffect(() => {
  //   if (suggestions.length > 0 && value) {
  //     setOpen(true)
  //     console.log(inputRef.current)
  //     inputRef.current?.focus()
  //   }
  // }, [suggestions.length, value])

  React.useEffect(() => {
    return cleanup
  }, [cleanup])

  React.useEffect(() => {
    if (wasReset) {
      setValue("")
      setOpen(false)
    }
  }, [wasReset])

  return (
    <div className="relative w-full">
      <Popover open={open && suggestions.length > 0} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder={placeholder}
              value={value}
              onChange={handleInputChange}
              className="pl-8"
              onKeyDown={handleInputKeyDown}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent 
          ref={contentRef}
          className="p-0 w-[var(--radix-popover-trigger-width)]" align="start" 
          onOpenAutoFocus={handlePreventFocusSteal}
          >
          <Command>
            <CommandGroup>
              {suggestions.map((suggestion) => (
                <CommandItem
                  key={suggestion.id}
                  onSelect={() => handleSelect(suggestion)}
                  className="cursor-pointer"
                >
                  {suggestion.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}