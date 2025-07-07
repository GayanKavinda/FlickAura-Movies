import React, { useEffect, useState } from 'react';
import { tmdb } from '../api/tmdb';

const People = () => {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await tmdb.get('/person/popular');
        setPeople(response.data.results); // Fetch all people
      } catch (error) {
        console.error('Error fetching people:', error);
      }
    };

    fetchPeople();
  }, []);

  return (
    <div className="bg-gray-950 px-6 py-10 overflow-hidden">
      <h2 className="text-white text-2xl font-bold mb-6">Popular People</h2>

      <div className="relative">
        <div className="flex animate-slide gap-6 w-max">
          {people.map((person) => (
            <div
              key={person.id}
              className="bg-gray-900 rounded-xl w-[140px] flex-shrink-0 shadow-lg hover:scale-105 transform transition duration-300"
            >
              <img
                src={
                  person.profile_path
                    ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
                    : "https://via.placeholder.com/300x450?text=No+Image"
                }
                alt={person.name}
                className="w-full h-[180px] object-cover rounded-t-xl"
              />
              <div className="p-2">
                <h3 className="text-white text-sm font-medium truncate">{person.name}</h3>
                <p className="text-gray-400 text-xs line-clamp-2">
                  {person.known_for.map((item) => item.title || item.name).join(', ') || 'No known works'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default People;