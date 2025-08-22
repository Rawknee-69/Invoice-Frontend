import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface DatePickerProps {
  value?: Date
  onValueChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  fromDate?: Date
  toDate?: Date
}

export function DatePicker({
  value,
  onValueChange,
  placeholder = "Pick a date",
  disabled = false,
  className,
  fromDate,
  toDate
}: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(value || new Date())
  const [selectedYear, setSelectedYear] = React.useState<number>(currentMonth.getFullYear())

  // Update current month when value changes
  React.useEffect(() => {
    if (value) {
      setCurrentMonth(value)
      setSelectedYear(value.getFullYear())
    }
  }, [value])

  // Handle year change
  const handleYearChange = (year: string) => {
    const newYear = parseInt(year)
    setSelectedYear(newYear)
    const newMonth = new Date(currentMonth)
    newMonth.setFullYear(newYear)
    setCurrentMonth(newMonth)
  }

  // Handle month navigation
  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth)
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)
    setSelectedYear(newMonth.getFullYear())
  }

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        handleMonthChange('prev')
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        handleMonthChange('next')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [currentMonth])

  // Generate year options (current year ± 10 years)
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          {/* Year and Month Navigation */}
          <div className="date-picker-nav flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
                <SelectTrigger className="date-picker-year-select h-8 text-sm font-medium">
                  <SelectValue />
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="date-picker-month text-sm font-medium">
                {currentMonth.toLocaleDateString('en-US', { month: 'long' })}
              </span>
            </div>
            <div className="date-picker-nav-buttons">
              <Button
                variant="ghost"
                size="sm"
                className="date-picker-nav-button h-8 w-8 p-0"
                onClick={() => handleMonthChange('prev')}
                disabled={fromDate && currentMonth <= fromDate}
                title="Previous month (←)"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="date-picker-nav-button h-8 w-8 p-0"
                onClick={() => handleMonthChange('next')}
                disabled={toDate && currentMonth >= toDate}
                title="Next month (→)"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <DayPicker
            mode="single"
            selected={value}
            onSelect={onValueChange}
            disabled={disabled}
            fromDate={fromDate}
            toDate={toDate}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            initialFocus
            className="p-0"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "hidden", // Hide default caption since we have custom navigation
              nav: "hidden", // Hide default navigation
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: cn(
                "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
                "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
              ),
              day: cn(
                "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
                "hover:bg-accent hover:text-accent-foreground transition-colors",
                "focus:bg-accent focus:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              ),
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
