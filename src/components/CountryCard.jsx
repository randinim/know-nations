import { Card, CardContent } from "../components/ui/card"
import { formatNumber } from "../lib/utils"

const CountryCard = ({ country, onClick }) => {
  return (
    <Card
      className="overflow-hidden transition-shadow hover:shadow-lg cursor-pointer country-card"
      onClick={onClick}
    >
      <div className="flag-container">
        <img
          src={country.flags.svg}
          alt={country.flags.alt || `Flag of ${country.name.common}`}
          className="flag-image"
        />
      </div>
      <CardContent className="pt-6 pb-2">
        <h2 className="text-xl font-bold mb-4 line-clamp-1">
          {country.name.common}
        </h2>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-semibold">Population:</span>{" "}
            {formatNumber(country.population)}
          </p>
          <p>
            <span className="font-semibold">Region:</span> {country.region}
          </p>
          {country.capital && country.capital.length > 0 && (
            <p>
              <span className="font-semibold">Capital:</span>{" "}
              {country.capital[0]}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default CountryCard
