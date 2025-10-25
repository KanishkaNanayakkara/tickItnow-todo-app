import { useQuery } from "@tanstack/react-query";
import { fetchRecentTasks } from "@/service/apiService";
import { ITask } from "@/types/common/types";

export const useGetRecentTasks = () => {

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<ITask[], Error>({
    queryKey: ["recentTasks"],
    queryFn: () => fetchRecentTasks(),
  });

  return {
    recentTasks: data || [],
    isLoadingTasks: isLoading,
    tasksError: error,
    refetchTasks: refetch,
  };
}