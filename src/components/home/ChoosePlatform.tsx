import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Label,
} from "@headlessui/react";

import { useState } from "react";

const streamingPlatforms = [
  { id: 1, name: "Netflix" },
  { id: 2, name: "Max" },
  { id: 3, name: "Youtube" },
  { id: 4, name: "Amazon Prime" },
  { id: 5, name: "Netflix" },
  { id: 6, name: "Max" },
  { id: 7, name: "Youtube" },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function ChoosePlatform() {
  const [query, setQuery] = useState("");
  const [selectedStreamingPlatform, setSelectedStreamingPlatform] =
    useState<any>(streamingPlatforms[0]);

  const filteredPeople =
    query === ""
      ? streamingPlatforms
      : streamingPlatforms.filter((person) => {
          return person.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox
      as="div"
      value={selectedStreamingPlatform}
      onChange={setSelectedStreamingPlatform}
    >
      <Label className="block text-sm font-medium leading-6 text-gray-900">
        Choose Streaming Platform
      </Label>
      <div className="relative mt-2">
        <ComboboxInput
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(person: any) => person?.name}
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </ComboboxButton>

        {filteredPeople.length > 0 && (
          <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-xs shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredPeople.map((person) => (
              <ComboboxOption
                key={person.id}
                value={person}
                className={({ focus }) =>
                  classNames(
                    "relative cursor-pointer select-none py-2 pl-3 pr-9",
                    focus ? "bg-indigo-600 text-white" : "text-gray-900"
                  )
                }
              >
                {({ focus, selected }) => (
                  <>
                    <span
                      className={classNames(
                        "block truncate",
                        selected && "font-semibold"
                      )}
                    >
                      {person.name}
                    </span>

                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          focus ? "text-white" : "text-indigo-600"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        )}
      </div>
    </Combobox>
  );
}
