import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config.js";
import { getIdFromUrl, capitalize, getSpriteUrl } from "../utils.js";

function PokemonList() {
  const [pokemons, setPokemons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCurrent = true;

    async function loadPokemons() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/pokemon?limit=20`);

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        const data = await response.json();

        if (isCurrent) {
          setPokemons(data.results);
        }
      } catch (err) {
        if (isCurrent) {
          setError(err.message);
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    loadPokemons();

    return () => {
      isCurrent = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="status homepage-loading">
        <div className="loading-ball">◓</div>
        <p>Loading your Pokémon...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status status-error">
        <p>Couldn't load the Pokémon list.</p>
        <small>{error}</small>
      </div>
    );
  }

  return (
    <section className="pokemon-section">
      <div className="pokemon-section-heading">
        <div>
          <p className="section-eyebrow">FIRST GENERATION</p>
          <h2>Choose your Pokémon</h2>
        </div>

        <span className="pokemon-count">
          {pokemons.length} discovered
        </span>
      </div>

      <div className="pokemon-grid">
        {pokemons.map((pokemon) => {
          const id = getIdFromUrl(pokemon.url);

          return (
            <Link
              key={pokemon.name}
              to={`/pokemon/${pokemon.name}`}
              className="pokemon-card"
            >
              <div className="card-top">
                <span className="card-id">
                  #{id.padStart(3, "0")}
                </span>

                <span className="card-arrow">↗</span>
              </div>

              <div className="pokemon-art-wrapper">
                <div className="pokemon-art-glow"></div>

                <img
                  className="pokemon-art"
                  src={getSpriteUrl(id)}
                  alt={pokemon.name}
                  width={120}
                  height={120}
                  loading="lazy"
                />
              </div>

              <div className="card-bottom">
                <h3>{capitalize(pokemon.name)}</h3>
                <span>View details</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default PokemonList;