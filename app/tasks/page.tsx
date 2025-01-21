'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheckCircle,
  faTrashCan,
  faPlusCircle,
} from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-regular-svg-icons'
import Link from 'next/link'
import {
  useDeleteTaskById,
  useTasks,
  useUpdateTaskById,
} from '../../api/requests/task'
import { Task } from '../../api/types/task'
import toast from 'react-hot-toast'

export default function Todo() {

  const { data: tasks = [] } = useTasks()
  const { mutateAsync: updateTaskById } = useUpdateTaskById();
  const { mutateAsync: deleteTaskById } = useDeleteTaskById();

  const handleUpdateTask = async (task: Task) => {
    try {
      await updateTaskById({
        id: task.id,
        title: task.title,
        color: task.color,
        completed: !task.completed,
      })
      toast.success('Task updated successfully')
    } catch (error) {
      toast.error('Failed to update task')
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTaskById(taskId);
      toast.success('Task deleted successfully')
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }

  return (
    <div className="container relative">
      <Link
        href="/tasks/create"
        className="w-full p-3 rounded-md absolute d-block text-center top-0 transform -translate-y-1/2 border-[#1e6f9f] text-[#f2f2f2] bg-[#1e6f9f]"
      >
        Create Task
        <FontAwesomeIcon className="ml-2" icon={faPlusCircle} />
      </Link>

      <div className="flex flex-col">
        <div className="flex flex-row justify-between pt-16">
          <div className="">
            <h2 className="font-bold text-[#4ea8de]">
              Tasks
              <span className="ml-2 text-[12px] rounded-full px-2 py-0.5 bg-[#333] text-[#d9d9d9]">
                {tasks?.length}
              </span>
            </h2>
          </div>
          <div className="">
            <h2 className="font-bold text-[#8284fa]">
              Completed
              <span className="ml-2 text-[12px] rounded-full px-2 py-0.5 bg-[#333] text-[#d9d9d9]">
                {tasks?.length
                  ? `${
                      tasks?.filter(
                        (task: { completed: boolean }) => task.completed,
                      ).length
                    } de ${tasks?.length}`
                  : '0'}
              </span>
            </h2>
          </div>
        </div>

        <div className="flex flex-col justify-center mt-4">
          {tasks
            .filter((task: Task) => !task.completed)
            .map((task: Task) => (
              <div
                key={task.id}
                className="mt-4 border rounded-md p-3 flex flex-row items-start justify-between border-[#333]"
              >
                <button
                  className="form-checkbox rounded-full focus:ring-0 focus:ring-offset-0 cursor-pointer mx-2"
                  onClick={() => {
                    handleUpdateTask(task)
                  }}
                >
                  <FontAwesomeIcon icon={faCircle} className="text-[#4ea8de]" />
                </button>
                <Link
                  href={`/tasks/edit/${task.id}`}
                  className="w-full mx-2 text-[#f2f2f2]"
                >
                  {task.title}
                </Link>
                <button
                  className="w-4 ml-2"
                  onClick={() => deleteTaskById(task.id)}
                >
                  <FontAwesomeIcon
                    icon={faTrashCan}
                    className="text-[#808080]"
                  />
                </button>
              </div>
            ))}
          {tasks
            .filter((task: Task) => task.completed)
            .map((task: Task) => (
              <div
                key={task.id}
                className="mt-4 border rounded-md p-3 flex flex-row items-start justify-between border-[#333]"
              >
                <button
                  className="form-checkbox rounded-full focus:ring-0 focus:ring-offset-0 cursor-pointer mx-2"
                  onClick={() => handleUpdateTask(task)}
                >
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-secondary rounded-full"
                  />
                </button>
                <Link
                  href={`/tasks/edit/${task.id}`}
                  className="w-full mx-2 text-[#808080] text-decoration-line: line-through"
                >
                  {task.title}
                </Link>
                <button
                  className="w-4 ml-2"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <FontAwesomeIcon
                    icon={faTrashCan}
                    className="text-[#808080]"
                  />
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
