import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE_URL } from "../config.js";
import { capitalize } from "../utils.js";

function DetailPage() {
  const { name } = useParams();

  const [pokemon, setPokemon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCurrent = true;

    async function loadPokemon() {
      setIsLoading(true);
      setError(null);
      setPokemon(null);

      try {
        const response = await fetch(`${API_BASE_URL}/pokemon/${name}`);

        if (!response.ok) {
          throw new Error(`No Pokémon named "${name}" — check the spelling.`);
        }

        const data = await response.json();

        if (isCurrent) {
          setPokemon(data);
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

    loadPokemon();

    return () => {
      isCurrent = false;
    };
  }, [name]);

  if (isLoading) {
    return (
      <div className="status">
        <div className="loading-ball">◓</div>
        <p>Finding your Pokémon...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-page">
        <Link to="/" className="back-link">
          ← Back to Pokédex
        </Link>

        <div className="error-box">
          <div className="error-icon">?</div>
          <h2>Oops!</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const artwork =
    pokemon.sprites.other?.["official-artwork"]?.front_default ||
    pokemon.sprites.front_default;

  return (
    <div className="detail-page">

      <Link to="/" className="back-link">
        ← Back to Pokédex
      </Link>

      <div className="detail-hero">

        <div className="detail-id">
          #{String(pokemon.id).padStart(3, "0")}
        </div>

        <div className="pokemon-image-wrapper">
          <div className="image-glow"></div>

          <img
            src={artwork}
            alt={pokemon.name}
            className="detail-pokemon-image"
          />
        </div>

        <h1 className="detail-name">
          {capitalize(pokemon.name)}
        </h1>

        <div className="type-list">
          {pokemon.types.map((type) => (
            <span
              key={type.type.name}
              className={`type-badge type-${type.type.name}`}
            >
              {type.type.name}
            </span>
          ))}
        </div>
      </div>

      <div className="info-grid">

        <div className="info-card">
          <span className="info-label">Height</span>
          <strong>{pokemon.height / 10} m</strong>
        </div>

        <div className="info-card">
          <span className="info-label">Weight</span>
          <strong>{pokemon.weight / 10} kg</strong>
        </div>

        <div className="info-card">
          <span className="info-label">Base XP</span>
          <strong>{pokemon.base_experience}</strong>
        </div>

      </div>

      <div className="stats-section">

        <div className="section-title">
          <span>Battle Stats</span>
          <span className="section-star">✦</span>
        </div>

        <div className="stats-container">
          {pokemon.stats.map((stat) => {
            const percentage = Math.min(
              (stat.base_stat / 150) * 100,
              100
            );

            return (
              <div className="stat-row" key={stat.stat.name}>

                <div className="stat-header">
                  <span className="stat-name">
                    {stat.stat.name.replace("-", " ")}
                  </span>

                  <span className="stat-value">
                    {stat.base_stat}
                  </span>
                </div>

                <div className="stat-bar">
                  <div
                    className="stat-fill"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}

export default DetailPage;