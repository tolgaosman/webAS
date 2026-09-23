import { useCallback, useEffect, useState } from "react";
import { createResource, deleteResource, listResource, reorderResource, updateResource, ApiError, formatApiError } from "../../lib/adminApi";
import { toastSuccess, toastError } from "../../lib/toast";

interface WithId {
  id: number;
}

/**
 * Shared list/create/update/delete/reorder state for a simple admin
 * resource (§Faz 5-7) — every "flat" tab (core skills, education,
 * languages, toolkit, certificates, bio paragraphs, hobbies,
 * specialties) uses this instead of repeating fetch/mutate/reload
 * boilerplate. Projects/experience use their own hook because they
 * also carry nested children in the same payload.
 */
export function useCrudResource<T extends WithId>(resource: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await listResource<T>(resource));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [resource]);

  useEffect(() => {
    reload();
  }, [reload]);

  const create = useCallback(
    async (payload: unknown) => {
      try {
        const item = await createResource<T>(resource, payload);
        await reload();
        toastSuccess("Kaydedildi.");
        return item;
      } catch (e) {
        toastError(formatApiError(e));
        throw e;
      }
    },
    [resource, reload]
  );

  const update = useCallback(
    async (id: number, payload: unknown) => {
      try {
        await updateResource<T>(resource, id, payload);
        await reload();
        toastSuccess("Değişiklikler kaydedildi.");
      } catch (e) {
        toastError(formatApiError(e));
        throw e;
      }
    },
    [resource, reload]
  );

  const remove = useCallback(
    async (id: number) => {
      if (!window.confirm("Silmek istediğinize emin misiniz?")) return;
      try {
        await deleteResource(resource, id);
        await reload();
        toastSuccess("Silindi.");
      } catch (e) {
        toastError(formatApiError(e));
        throw e;
      }
    },
    [resource, reload]
  );

  const reorder = useCallback(
    async (ids: number[]) => {
      // Optimistic — the drag already shows the new order.
      setItems((prev) => ids.map((id) => prev.find((i) => i.id === id)!).filter(Boolean));
      try {
        await reorderResource(resource, ids);
      } catch (e) {
        toastError(formatApiError(e));
        throw e;
      }
    },
    [resource]
  );

  return { items, loading, error, create, update, remove, reorder, reload };
}

export { ApiError };
