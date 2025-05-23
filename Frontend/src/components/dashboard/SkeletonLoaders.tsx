
import "./loading-animations.css";

// Componente de carga para el RadarChart
export const RadarChartSkeleton = () => (
  <div className="p-6 bg-white rounded-[14px] flex items-center justify-center h-[300px]">
    <div className="w-full max-w-[250px] aspect-square rounded-full skeleton-pulse relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-gray-400 text-sm font-medium">
          Cargando estadísticas
        </span>
      </div>
    </div>
  </div>
);

// Componente de carga para el CalendarCard
export const CalendarCardSkeleton = () => (
  <div className="p-4 bg-white rounded-[14px] h-[300px]">
    <div className="w-full h-8 skeleton-pulse rounded mb-4"></div>
    <div className="grid grid-cols-7 gap-1">
      {Array.from({ length: 35 }).map((_, i) => (
        <div
          key={i}
          className="aspect-square skeleton-pulse rounded"
          style={{ animationDelay: `${i * 50}ms` }}
        ></div>
      ))}
    </div>
  </div>
);

// Componente de carga para el CreateTaskCard
export const CreateTaskCardSkeleton = () => (
  <div className="p-4 bg-white rounded-[14px] h-[120px] flex flex-col justify-center">
    <div className="w-32 h-6 skeleton-pulse rounded mb-2"></div>
    <div className="w-48 h-4 skeleton-pulse rounded mb-4"></div>
    <div className="w-24 h-8 skeleton-pulse rounded"></div>
  </div>
);

// Componente de carga para el Timeline
export const TimelineSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className="flex items-center bg-white p-3 rounded-md"
        style={{ animationDelay: `${i * 100}ms` }}
      >
        <div className="w-2 h-10 skeleton-pulse rounded-full mr-3"></div>
        <div className="flex-1">
          <div className="w-32 h-4 skeleton-pulse rounded mb-2"></div>
          <div className="w-20 h-3 skeleton-pulse rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

// Componente de carga para el Modal
export const ModalSkeleton = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 fade-in">
    <div className="bg-white rounded-lg p-6 w-full max-w-md">
      <div className="w-40 h-6 skeleton-pulse rounded mb-6"></div>
      <div className="space-y-4">
        <div className="w-full h-10 skeleton-pulse rounded"></div>
        <div className="w-full h-24 skeleton-pulse rounded"></div>
        <div className="w-full h-10 skeleton-pulse rounded"></div>
      </div>
      <div className="flex justify-end mt-6">
        <div className="w-20 h-8 skeleton-pulse rounded mr-2"></div>
        <div className="w-20 h-8 skeleton-pulse rounded"></div>
      </div>
    </div>
  </div>
);
