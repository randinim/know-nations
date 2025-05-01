import CountryCard from "./CountryCard"

const CountryList = ({ countries, onCountryClick }) => {
  if (countries.length === 0) {
    return (
      <div className="py-10 text-center">
        <h3 className="text-xl text-muted-foreground">No countries found</h3>
        <p className="mt-2">Try adjusting your search or filter</p>
      </div>
    )
  }

  return (
    <div className="country-grid fade-in">
      {countries.map(country => (
        <CountryCard
          key={country.cca3}
          country={country}
          onClick={() => onCountryClick(country.cca3)}
        />
      ))}
    </div>
  )
}

export default CountryList
