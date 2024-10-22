const regionSelect = document.getElementById('regionSelect');
        const pokemonList = document.getElementById('pokemonList');

        // Cargar las regiones
        fetch('https://pokeapi.co/api/v2/pokedex/')
            .then(response => response.json())
            .then(data => {
                data.results.forEach(region => {
                    const option = document.createElement('option');
                    option.value = region.url;
                    option.textContent = region.name.charAt(0).toUpperCase() + region.name.slice(1);
                    regionSelect.appendChild(option);
                });
            });

        regionSelect.addEventListener('change', (event) => {
            const selectedRegionUrl = event.target.value;
            if (selectedRegionUrl) {
                fetch(selectedRegionUrl)
                    .then(response => response.json())
                    .then(data => {
                        pokemonList.innerHTML = '';
                        const pokemonPromises = data.pokemon_entries.slice(0, 50).map(entry => {
                            return fetch(entry.pokemon_species.url)
                                .then(response => response.json())
                                .then(pokemonData => {
                                    const pokemonDiv = document.createElement('div');
                                    pokemonDiv.classList.add('pokemon');

                                    const img = document.createElement('img');
                                    img.src = `https://pokeapi.co/media/sprites/pokemon/${pokemonData.id}.png`;
                                    pokemonDiv.appendChild(img);

                                    const name = document.createElement('h4');
                                    name.textContent = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);
                                    pokemonDiv.appendChild(name);

                                    const types = document.createElement('p');
                                    types.textContent = pokemonData.types.map(type => type.type.name).join(', ');
                                    pokemonDiv.appendChild(types);

                                    const button = document.createElement('button');
                                    button.textContent = 'Agregar a mi equipo';
                                    button.onclick = () => addToTeam(pokemonData);
                                    pokemonDiv.appendChild(button);

                                    pokemonList.appendChild(pokemonDiv);
                                });
                        });
                        Promise.all(pokemonPromises);
                    });
            }
        });

        function addToTeam(pokemon) {
            let team = JSON.parse(localStorage.getItem('team')) || [];
            if (!team.some(p => p.id === pokemon.id)) {
                team.push(pokemon);
                localStorage.setItem('team', JSON.stringify(team));
                alert(`${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} agregado a tu equipo.`);
            } else {
                alert(`${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} ya está en tu equipo.`);
            }
        }
