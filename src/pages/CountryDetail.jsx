import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getCountryByCode } from "../services/api"
import { formatNumber } from "../lib/utils"
import { useToast } from "../components/ui/use-toast"
import { Button } from "../components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Skeleton } from "../components/ui/skeleton"

const CountryDetail = () => {
  const { code } = useParams()
  const [country, setCountry] = useState(null)
  const [borderCountries, setBorderCountries] = useState([])
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const fetchCountryData = async () => {
      if (!code) return

      setLoading(true)
      try {
        const data = await getCountryByCode(code)
        setCountry(data)

        // Fetch border countries if available
        if (data.borders && data.borders.length > 0) {
          const borderPromises = data.borders.map(border =>
            getCountryByCode(border)
          )
          const borderData = await Promise.all(borderPromises)
          setBorderCountries(borderData)
        }
      } catch (error) {
        toast({
          title: "Error fetching country details",
          description: "Please try again later.",
          variant: "destructive"
        })
        navigate("/")
      } finally {
        setLoading(false)
      }
    }

    fetchCountryData()
  }, [code, navigate, toast])

  const handleBack = () => {
    navigate(-1)
  }

  const handleBorderCountryClick = countryCode => {
    navigate(`/country/${countryCode}`)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="outline" onClick={handleBack} className="mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="grid md:grid-cols-2 gap-16">
          <Skeleton className="h-80 w-full" />

          <div className="space-y-8">
            <Skeleton className="h-10 w-3/4" />

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>

              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            </div>

            <div>
              <Skeleton className="h-8 w-1/3 mb-4" />
              <div className="flex flex-wrap gap-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-24" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!country) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Country not found</p>
        <Button onClick={() => navigate("/")} className="mt-4">
          Return to Home
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="outline" onClick={handleBack} className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="grid md:grid-cols-2 gap-16">
        <div className="shadow-md rounded-lg overflow-hidden">
          <img
            src={country.flags.svg}
            alt={country.flags.alt || `Flag of ${country.name.common}`}
            className="w-full h-auto object-cover"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-8">{country.name.common}</h1>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-2">
              {country.name.official !== country.name.common && (
                <p>
                  <span className="font-semibold">Official Name:</span>{" "}
                  {country.name.official}
                </p>
              )}

              <p>
                <span className="font-semibold">Population:</span>{" "}
                {formatNumber(country.population)}
              </p>

              <p>
                <span className="font-semibold">Region:</span> {country.region}
              </p>

              {country.subregion && (
                <p>
                  <span className="font-semibold">Sub Region:</span>{" "}
                  {country.subregion}
                </p>
              )}

              {country.capital && country.capital.length > 0 && (
                <p>
                  <span className="font-semibold">Capital:</span>{" "}
                  {country.capital.join(", ")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              {country.currencies && (
                <p>
                  <span className="font-semibold">Currencies:</span>{" "}
                  {Object.values(country.currencies)
                    .map(currency => `${currency.name} (${currency.symbol})`)
                    .join(", ")}
                </p>
              )}

              {country.languages && (
                <p>
                  <span className="font-semibold">Languages:</span>{" "}
                  {Object.values(country.languages).join(", ")}
                </p>
              )}

              {country.area && (
                <p>
                  <span className="font-semibold">Area:</span>{" "}
                  {formatNumber(country.area)} km²
                </p>
              )}

              {country.continents && (
                <p>
                  <span className="font-semibold">Continent:</span>{" "}
                  {country.continents.join(", ")}
                </p>
              )}
            </div>
          </div>

          {borderCountries.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Border Countries:</h2>
              <div className="flex flex-wrap gap-2">
                {borderCountries.map(border => (
                  <Button
                    key={border.cca3}
                    variant="outline"
                    onClick={() => handleBorderCountryClick(border.cca3)}
                    className="mb-2"
                  >
                    {border.name.common}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {country.maps && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Maps:</h2>
              <div className="space-x-4">
                <a
                  href={country.maps.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View on Google Maps
                </a>
                <a
                  href={country.maps.openStreetMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View on OpenStreetMap
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CountryDetail
