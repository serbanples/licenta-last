import { CircularProgress } from "./circular-progress";

export function UploadProgress({ percent }: { percent: number }) {
  return (
    <div className="w-12 h-12">
      <CircularProgress percent={percent} />
    </div>
  );
}
