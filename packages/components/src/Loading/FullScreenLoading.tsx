import { Transition } from '@headlessui/react'

export function FullScreenLoading() {
  return (
    <Transition
      appear
      show
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
    >
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="mt-4 text-gray-600 dark:text-gray-300">加载中...</span>
        </div>
      </div>
    </Transition>
  )
}
