import React, { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";

function Suggestions() {
  const [suggestions, setSuggestions] = useState();

  useEffect(() => {
    const suggestions = [...Array(5)].map((_, i) => ({
      userId: i,
      username: faker.internet.userName(),
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
      password: faker.internet.password(),
      registeredAt: faker.date.past(),
      birthday: faker.date.birthdate(),
    }));
    setSuggestions(suggestions);
  }, []);

  return (
    <div className="mt-5 ml-10">
      <div className="flex justify-between text-sm mb-5">
        <h3 className="text-sm font-bold text-gray-400">Suggestions</h3>
        <button className="text-gray-600 font-semibold">See All</button>
      </div>
      {suggestions?.map((profile) => (
        <div key={profile.id} className="flex justify-between mt-3">
          <img className="w-10 h-10 rounded-full" src={profile.avatar} />
          <div className="flex-1 ml-4">
            <h2 className="font-semibold text-sm">{profile.username}</h2>
            <h3 className="text-xs text-gray-400">{profile.email}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Suggestions;
