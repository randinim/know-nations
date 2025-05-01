import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Search } from "lucide-react"

const SearchBar = ({ onSearch, placeholder = "Search for a country..." }) => {
  const [query, setQuery] = useState("")

  const handleSubmit = e => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="relative flex items-center">
        <Input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pr-16 h-12 text-base shadow-sm"
        />
        <Button
          type="submit"
          className="absolute right-0 h-full px-4"
          variant="ghost"
        >
          <Search className="w-5 h-5" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
    </form>
  )
}

export default SearchBar
