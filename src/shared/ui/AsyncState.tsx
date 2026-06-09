import type { ReactNode } from "react";

export function AsyncState<T>({
  data,
  isLoading,
  isError,
  loadingTitle = "Loading workspace",
  emptyTitle = "No records found",
  errorTitle = "Something went wrong",
  children,
}: {
  data: T[] | undefined;
  isLoading: boolean;
  isError: boolean;
  loadingTitle?: string;
  emptyTitle?: string;
  errorTitle?: string;
  children: (data: T[]) => ReactNode;
}) {
  if (isLoading) return <StatePanel title={loadingTitle} tone="neutral" />;
  if (isError) return <StatePanel title={errorTitle} tone="danger" detail="Refresh or check the connected service." />;
  if (!data || data.length === 0) return <StatePanel title={emptyTitle} tone="neutral" detail="Try another filter or data scope." />;
  return <>{children(data)}</>;
}

export function StatePanel({
  title,
  detail,
  tone = "neutral",
}: {
  title: string;
  detail?: string;
  tone?: "neutral" | "danger";
}) {
  return (
    <section className={`state-panel state-${tone}`} role={tone === "danger" ? "alert" : "status"}>
      <strong>{title}</strong>
      {detail ? <p>{detail}</p> : null}
    </section>
  );
}
