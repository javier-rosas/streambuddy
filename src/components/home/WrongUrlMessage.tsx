import { XCircleIcon } from "@heroicons/react/20/solid";

export default function WrongUrlMessage({ message }: { message: string }) {
  return (
    <div className="mt-8 mb-8 rounded-md bg-blue-50 p-4">
      <div className="flex items-center	">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className="text-left text-sm text-blue-700">{message}</p>
        </div>
      </div>
    </div>
  );
}
