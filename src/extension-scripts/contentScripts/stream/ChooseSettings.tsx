export default function ChooseSettings({ options }: any) {
  return (
    <div>
      <label
        htmlFor="audio"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Audio
      </label>
      <select
        id="audio"
        name="audio"
        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
        defaultValue="Canada"
      >
        {options.map((option: any) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
