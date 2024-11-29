import ErrorPage500 from '@/components/common/500'

export function Error500() {
  return (
    <div
      className="bg-white m-1rem box-border"
      style={{
        minHeight: 'calc(100vh - 220px)',
      }}
    >
      <ErrorPage500 />
    </div>
  )
}
