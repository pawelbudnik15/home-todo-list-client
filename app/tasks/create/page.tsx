'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { useCreateTask } from '@/api/requests/task'
import toast from 'react-hot-toast'

export default function CreateTask() {
  const router = useRouter()
  const { mutateAsync: createTask } = useCreateTask()
  const [newTaskTitle, setnewTaskTitle] = useState('')
  const [selectedColor, setSelectedColor] = useState('#ff3b30')


  const handleAddTask = async () => {
    try {
      if (newTaskTitle.trim()) {
        await createTask({ title: newTaskTitle, color: selectedColor })
        toast.success('Task created successfully')
        router.push('/tasks')
      }
    } catch (error) {
      toast.error('Failed to create task')
    }
  }

  return (
    <div className="container mx-auto max-w-2xl p-4 pt-16">
      <Link href="/tasks" className="d-block p-3 rounded-md">
        <FontAwesomeIcon icon={faArrowLeft} />
      </Link>

      <div className="flex flex-col gap-4 mt-16">
        <div className="flex flex-col gap-2 mb-4">
          <h2 className="font-bold text-[#4ea8de]">Title</h2>
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setnewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            placeholder="Ex. Brush you teeth"
            className="text-[14px] p-3 rounded-md bg-[#262626] border border-[#333] focus:border-[#1e6f9f] focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2 mb-8">
          <h2 className="font-bold text-[#4ea8de]">Color</h2>
          <ul className="flex flex-row gap-4">
            {[
              '#ff3b30',
              '#ff9500',
              '#ffcc00',
              '#34c759',
              '#007Aff',
              '#5856D6',
              '#AF52DE',
              '#FF2D55',
              '#A2845E',
            ].map((color) => (
              <li key={color}>
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="taskColor"
                    value={color}
                    checked={selectedColor === color}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="sr-only" // Hide the default radio button
                  />
                  <div
                    className={`w-12 h-12 rounded-full ${
                      selectedColor === color
                        ? 'ring-2 ring-offset-2 ring-[#1e6f9f]'
                        : ''
                    }`}
                    style={{ backgroundColor: color }}
                  ></div>
                </label>
              </li>
            ))}
          </ul>
        </div>
        <button
          className="flex-1 p-3 rounded-md text-[#f2f2f2] bg-[#1e6f9f] border border-[#1e6f9f]"
          onClick={handleAddTask}
        >
          Add Task
          <FontAwesomeIcon className="ml-2" icon={faPlusCircle} />
        </button>
      </div>
    </div>
  )
}
