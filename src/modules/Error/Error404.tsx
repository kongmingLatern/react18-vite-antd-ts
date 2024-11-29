import ErrorPage404 from '@/components/common/404'

export function Error404() {
  return (
    <div
      className="bg-white m-1rem box-border"
      style={{
        minHeight: 'calc(100vh - 220px)',
      }}
    >
      <ErrorPage404 />
    </div>
  )
}
