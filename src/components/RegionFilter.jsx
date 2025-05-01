import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../components/ui/select"

const RegionFilter = ({ regions, selectedRegion, onRegionChange }) => {
  return (
    <div className="w-full max-w-xs">
      <Select value={selectedRegion} onValueChange={onRegionChange}>
        <SelectTrigger className="h-12 text-base">
          <SelectValue placeholder="Filter by Region" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {regions.map(region => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export default RegionFilter
