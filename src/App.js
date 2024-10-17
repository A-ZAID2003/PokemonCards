import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PokemonCard from './components/PokemonCard';
import './App.css'; // Optional for styling

const App = () => {
  const [pokemons, setPokemons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPokemons, setFilteredPokemons] = useState([]);

  useEffect(() => {
    const fetchPokemons = async () => {
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=150');
      const pokemonDataPromises = response.data.results.map(pokemon =>
        axios.get(pokemon.url)
      );
      const pokemonDataResponses = await Promise.all(pokemonDataPromises);
      setPokemons(pokemonDataResponses.map(res => res.data));
      setFilteredPokemons(pokemonDataResponses.map(res => res.data));
    };
    fetchPokemons();
  }, []);

  useEffect(() => {
    setFilteredPokemons(
      pokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, pokemons]);

  return (
    <div className="app">
      <h1>Pokemon List</h1>
      <input
        type="text"
        placeholder="Search Pokemon"
        onChange={e => setSearchTerm(e.target.value)}
      />
      <div className="pokemon-container">
        {filteredPokemons.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
    </div>
  );
};

export default App;
