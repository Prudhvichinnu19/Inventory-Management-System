import { Skeleton } from "@/components/ui/skeleton";

interface ApiStatusProps {
  status?: string;
  lastRequest: string;
  endpoint: string;
  responseTime: string;
  isLoading?: boolean;
}

export default function ApiStatus({
  status = "disconnected",
  lastRequest,
  endpoint,
  responseTime,
  isLoading = false
}: ApiStatusProps) {
  if (isLoading) {
    return (
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">API Connection</h3>
          <div className="mt-5">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1"><Skeleton className="h-4 w-20" /></dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Last Request</dt>
                <dd className="mt-1"><Skeleton className="h-4 w-24" /></dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Endpoint</dt>
                <dd className="mt-1"><Skeleton className="h-4 w-32" /></dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Response Time</dt>
                <dd className="mt-1"><Skeleton className="h-4 w-16" /></dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">API Connection</h3>
        <div className="mt-5">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {status === "connected" ? (
                  <span className="text-green-500">Connected</span>
                ) : (
                  <span className="text-red-500">Disconnected</span>
                )}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Last Request</dt>
              <dd className="mt-1 text-sm text-gray-900">{lastRequest}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Endpoint</dt>
              <dd className="mt-1 text-sm text-gray-900">{endpoint}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Response Time</dt>
              <dd className="mt-1 text-sm text-gray-900">{responseTime}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
