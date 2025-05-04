import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getAllRegions, getQueryParams, updateUrlParams } from "../lib/utils"
import { useToast } from "../components/ui/use-toast"
import SearchBar from "../components/SearchBar"
import RegionFilter from "../components/RegionFilter"
import CountryList from "../components/CountryList"
import AdvancedFilter from "../components/AdvancedFilter"
import { Skeleton } from "../components/ui/skeleton"
import { getAllCountries, getCountriesByName, getCountriesByRegion } from "../services/api"
import Header from "../components/Header";

const Index = () => {
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [regions, setRegions] = useState(["All"])
  const [selectedRegion, setSelectedRegion] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true)
        const data = await getAllCountries()
        setCountries(data)
        setFilteredCountries(data)

        const allRegions = getAllRegions(data)
        setRegions(allRegions)

        const params = getQueryParams()
        if (params.region && params.region !== "All") {
          setSelectedRegion(params.region)
          handleRegionChange(params.region, data)
        }

        if (params.search) {
          setSearchQuery(params.search)
          handleSearch(params.search, data)
        }
      } catch (error) {
        toast({
          title: "Error fetching countries",
          description: "Please try again later.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [toast])

  const handleSearch = async (query, allCountries) => {
    setSearchQuery(query)
    updateUrlParams({ search: query, region: selectedRegion })

    if (!query.trim()) {
      handleRegionChange(selectedRegion, allCountries || countries)
      return
    }

    setLoading(true)

    try {
      if (selectedRegion !== "All") {
        const filtered = filteredCountries.filter(country =>
          country.name.common.toLowerCase().includes(query.toLowerCase())
        )
        setFilteredCountries(filtered)
      } else {
        const data = await getCountriesByName(query)
        setFilteredCountries(data)
      }
    } catch (error) {
      toast({
        title: "Error searching countries",
        description: "Please try again with a different search term.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRegionChange = async (region, allCountries) => {
    setSelectedRegion(region)
    updateUrlParams({ search: searchQuery, region })

    setLoading(true)

    try {
      if (searchQuery && region === "All") {
        const searchResults = await getCountriesByName(searchQuery)
        setFilteredCountries(searchResults)
      } else if (region === "All") {
        setFilteredCountries(allCountries || countries)
      } else {
        const regionData = await getCountriesByRegion(region)

        if (searchQuery) {
          const filtered = regionData.filter(country =>
            country.name.common
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          )
          setFilteredCountries(filtered)
        } else {
          setFilteredCountries(regionData)
        }
      }
    } catch (error) {
      toast({
        title: "Error filtering by region",
        description: "Please try again later.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCountryClick = countryCode => {
    navigate(`/country/${countryCode}`)
  }

  const applyAdvancedFilters = (countries, filters) => {
    return countries.filter(country => {
      return filters.every(filter => {
        if (filter.type === "population") {
          const population = country.population
          switch (filter.value) {
            case "lt1m":
              return population < 1000000
            case "1m-10m":
              return population >= 1000000 && population <= 10000000
            case "gt10m":
              return population > 10000000
            default:
              return true
          }
        }
        return true
      })
    })
  }

  const handleAdvancedFilters = filters => {
    if (filters.length === 0) {
      handleRegionChange(selectedRegion)
      return
    }

    const filtered = applyAdvancedFilters(filteredCountries, filters)
    setFilteredCountries(filtered)
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-primary">
          Country Explorer
        </h1>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <div className="flex flex-col gap-4 md:w-1/2">
            <SearchBar onSearch={handleSearch} />
            <AdvancedFilter onFilterChange={handleAdvancedFilters} />
          </div>
          <RegionFilter
            regions={regions}
            selectedRegion={selectedRegion}
            onRegionChange={handleRegionChange}
          />
        </div>

        {loading ? (
          <div className="country-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <div className="px-6 py-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <CountryList
            countries={filteredCountries}
            onCountryClick={handleCountryClick}
          />
        )}
      </div>
    </>
  )
}

export default Index
