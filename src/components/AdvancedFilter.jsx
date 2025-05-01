import { useState } from "react"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent
} from "../components/ui/collapsible"
import { Checkbox } from "../components/ui/checkbox"
import { Filter } from "lucide-react"
import { Button } from "../components/ui/button"

const AdvancedFilter = ({ onFilterChange }) => {
  const [selectedFilters, setSelectedFilters] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  const populationFilters = [
    { type: "population", value: "lt1m", label: "Less than 1M" },
    { type: "population", value: "1m-10m", label: "1M - 10M" },
    { type: "population", value: "gt10m", label: "More than 10M" }
  ]

  const handleFilterChange = (filter, checked) => {
    let newFilters

    if (checked) {
      // Remove other population filters if this is a population filter
      if (filter.type === "population") {
        newFilters = [
          ...selectedFilters.filter(f => f.type !== "population"),
          filter
        ]
      } else {
        newFilters = [...selectedFilters, filter]
      }
    } else {
      newFilters = selectedFilters.filter(
        f => !(f.type === filter.type && f.value === filter.value)
      )
    }

    setSelectedFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Advanced Filters
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-4 space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Population</h3>
          <div className="grid grid-cols-1 gap-2">
            {populationFilters.map(filter => (
              <div key={filter.value} className="flex items-center space-x-2">
                <Checkbox
                  id={filter.value}
                  checked={selectedFilters.some(
                    f => f.type === filter.type && f.value === filter.value
                  )}
                  onCheckedChange={checked =>
                    handleFilterChange(filter, checked)
                  }
                />
                <label
                  htmlFor={filter.value}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {filter.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default AdvancedFilter
