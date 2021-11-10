import { useEffect, useState } from "react";
import faker from "faker";

function Suggestions() {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const suggestions = [...Array(5)].map((_, i) => ({
      ...faker.helpers.contextualCard(),
      id: i,
    }));

    setSuggestions(suggestions);
  }, []);
  return (
    <div className="ml-10 mt-4 ">
      <div className="font-bold text-sm flex items-center justify-between">
        <p>Suggestions for you</p>
        <button className="font-semibold text-gray-600">See All</button>
      </div>
      {suggestions.map((item) => (
        <div key={item.id} className="mt-3 flex items-center justify-between">
          <img
            className="rounded-full h-10 w-10 p-[2px] border"
            src={item.avatar}
            alt=""
          />

          <div className="flex-1 ml-4">
            <h2 className="text-sm font-semibold">{item.name}</h2>
            <h3 className="text-xs text-gray-500">
              works at {item.company.name}
            </h3>
          </div>
          <button className="text-blue-400 text-sm font-semibold">
            Follow
          </button>
        </div>
      ))}
    </div>
  );
}

export default Suggestions;
