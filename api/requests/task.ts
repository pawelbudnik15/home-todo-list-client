import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { QueryKey } from '../QueryKey'
import axios from 'axios'
import { CreateTaskInput, Task } from '../types/task'

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function useTasks() {
  return useQuery({
    queryKey: [QueryKey.TASKS],
    queryFn: async () => {
      const { data } = await axios.get<Task[]>(`/tasks`, {
        baseURL,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      console.log("data", data)
      return data
    },
    enabled: true,
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (task: CreateTaskInput) => {
      const { data } = await axios.post<Task>(`/tasks`, task, {
        baseURL,
      })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.TASKS] })
    },
  })
}

export function useGetTaskById(id: string) {
  return useQuery({
    queryKey: [QueryKey.TASK, +id],
    queryFn: async () => {
      if (!id) throw new Error('Task ID is required')
      
      try {
        const { data } = await axios.get<Task>(`/tasks/${id}`, {
          baseURL,
        })
        return data
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(error.response?.data?.message || 'Failed to fetch task')
        }
        throw error
      }
    },
    enabled: !!id,
    retry: 2,
  })
}

export function useUpdateTaskById() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (task: Task) => {
      try {
        const { data } = await axios.put<Task>(`/tasks/${task.id}`, task, {
          baseURL,
        })
        return data
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(error.response?.data?.message || 'Failed to update task')
        }
        throw error
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.TASK, +variables.id] })
      queryClient.invalidateQueries({ queryKey: [QueryKey.TASKS] })
    },
  })
}

export function useDeleteTaskById() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete<Task>(`/tasks/${id}`, {
        baseURL,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.TASKS] })
    },
  })
}
