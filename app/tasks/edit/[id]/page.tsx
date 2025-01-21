'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCheck } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { useGetTaskById, useUpdateTaskById } from '@/api/requests/task'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { QueryKey } from '@/api/QueryKey'
import { useQueryClient } from '@tanstack/react-query'

const schema = yup.object({
  title: yup.string().required('Title is required').trim(),
  color: yup.string().required('Color is required'),
}).required()

type FormData = yup.InferType<typeof schema>

export default function EditTodo() {
  const router = useRouter()
  const params = useParams<{id: string}>()
  const queryClient = useQueryClient()
  const { data: task, isLoading } = useGetTaskById(params?.id);
  const { mutateAsync: updateTask } = useUpdateTaskById()
  
  const { register, handleSubmit, setValue, formState: { errors }, watch } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      color: '#ff3b30'
    }
  })

  useEffect(() => {
    if (task) {
      setValue('title', task.title)
      setValue('color', task.color)
    }
  }, [task, setValue])

  const onSubmit = async (data: FormData) => {
    if (task) {
      try {
        await updateTask({ 
          id: task.id, 
          title: data.title, 
          color: data.color, 
          completed: false 
        })
        
        toast.success('Task updated successfully')
        router.push('/tasks')
      } catch (error) {
        toast.error('Failed to update task')
      }
    }
  }

  return (
    <div className="container mx-auto max-w-2xl p-4 pt-16">
      <Link href="/tasks" className="d-block p-3 rounded-md">
        <FontAwesomeIcon icon={faArrowLeft} />
      </Link>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-16">
        <div className="flex flex-col gap-2 mb-4">
          <h2 className="font-bold text-[#4ea8de]">Edit Title</h2>
          <input
            {...register('title')}
            type="text"
            placeholder="Ex. Brush your teeth"
            className="text-[14px] p-3 rounded-md bg-[#262626] border border-[#333] focus:border-[#1e6f9f] focus:outline-none"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 mb-8">
          <h2 className="font-bold text-[#4ea8de]">Color</h2>
          {!isLoading && (
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
                      value={color}
                      {...register('color')}
                      className="sr-only"
                      defaultChecked={task?.color === color}
                    />
                    <div 
                      className={`w-12 h-12 rounded-full ${watch('color') === color ? 'ring-2 ring-offset-2 ring-[#1e6f9f]' : ''}`}
                      style={{ backgroundColor: color }}
                    ></div>
                  </label>
                </li>
              ))}
            </ul>
          )}
          {errors.color && (
            <p className="text-red-500 text-sm">{errors.color.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="flex-1 p-3 rounded-md text-[#f2f2f2] bg-[#1e6f9f] border border-[#1e6f9f]"
        >
          Save
          <FontAwesomeIcon className="ml-2" icon={faCheck} />
        </button>
      </form>
    </div>
  )
}