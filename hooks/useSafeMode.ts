import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const SAFE_MODE_KEY = "safeMode";

// Get safe mode from localStorage
const getSafeModeFromStorage = (): boolean => {
  try {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem(SAFE_MODE_KEY);
    return saved !== null ? JSON.parse(saved) : true;
  } catch {
    return true;
  }
};

// Save safe mode to localStorage
const setSafeModeToStorage = (safeMode: boolean): void => {
  try {
    localStorage.setItem(SAFE_MODE_KEY, JSON.stringify(safeMode));
  } catch (error) {
    console.error("Failed to save safe mode to localStorage:", error);
  }
};

export const useSafeMode = () => {
  const queryClient = useQueryClient();

  // Query untuk mendapatkan safe mode
  const { data: safeMode = true } = useQuery({
    queryKey: ["safeMode"],
    queryFn: getSafeModeFromStorage,
    staleTime: Infinity, // Data tidak akan stale
    gcTime: Infinity, // Garbage collection time
  });

  // Mutation untuk mengubah safe mode
  const toggleSafeModeQuery = useMutation({
    mutationFn: async (newSafeMode: boolean) => {
      setSafeModeToStorage(newSafeMode);
      return newSafeMode;
    },
    onSuccess: (newSafeMode) => {
      // Update cache dengan nilai baru
      queryClient.setQueryData(["safeMode"], newSafeMode);
    },
    onError: (error) => {
      console.error("Failed to toggle safe mode:", error);
    },
  });

  const toggleSafeMode = () => {
    toggleSafeModeQuery.mutate(!safeMode);
  };

  return {
    safeMode,
    toggleSafeMode,
    isToggling: toggleSafeModeQuery.isPending,
  };
};
