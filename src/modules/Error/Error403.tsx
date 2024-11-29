import ErrorPage403 from '@/components/common/403'

export function Error403() {
  return (
    <div
      className="bg-white m-1rem box-border"
      style={{
        minHeight: 'calc(100vh - 220px)',
      }}
    >
      <ErrorPage403 />
    </div>
  )
}
