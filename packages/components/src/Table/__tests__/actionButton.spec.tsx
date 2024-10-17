import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ActionButton } from '../helpers/ActionButton'

// Mock antd message
vi.mock('antd', async () => {
  const actual = await vi.importActual('antd')
  return {
    ...actual,
    message: {
      success: vi.fn(),
    },
  }
})

// Mock useDrawer hook
vi.mock('@react18-vite-antd-ts/hooks', () => ({
  useDrawer: () => ({
    showDrawer: vi.fn(),
    DrawerComponent: () => null,
  }),
}))

describe('actionButton', () => {
  const mockRecord = { id: 1, name: 'John Doe' }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders visible actions correctly', () => {
    render(<ActionButton record={mockRecord} index={0} />)

    expect(screen.getByText('查看')).toBeDefined()
    expect(screen.getByText('编辑')).toBeDefined()
    expect(screen.getByText('删除')).toBeDefined()
  })

  it('renders "更多" dropdown when there are hidden actions', () => {
    const customActions = [
      { key: 'custom1', text: 'Custom 1' },
      { key: 'custom2', text: 'Custom 2' },
      { key: 'custom3', text: 'Custom 3' },
      { key: 'custom4', text: 'Custom 4' },
    ]

    render(
      <ActionButton
        record={mockRecord}
        actions={customActions}
        maxVisible={3}
        index={0}
      />,
    )

    expect(screen.getByText('更多')).toBeDefined()
  })

  it('calls onView when view action is clicked', () => {
    const onView = vi.fn()
    render(<ActionButton record={mockRecord} onView={onView} index={0} />)

    fireEvent.click(screen.getByText('查看'))
    expect(onView).toHaveBeenCalledWith(mockRecord)
  })

  it('calls onEdit when edit action is clicked', () => {
    const onEdit = vi.fn()
    render(<ActionButton record={mockRecord} onEdit={onEdit} index={0} />)

    fireEvent.click(screen.getByText('编辑'))
    expect(onEdit).toHaveBeenCalledWith(mockRecord)
  })

  it('shows confirmation dialog when delete action is clicked', async () => {
    const onDelete = vi.fn()
    render(<ActionButton record={mockRecord} onDelete={onDelete} index={0} />)

    fireEvent.click(screen.getByText('删除'))

    // Wait for the confirmation dialog to appear
    await waitFor(() => {
      expect(screen.getByText('确定要删除吗？')).toBeDefined()
    })

    // // Confirm deletion
    // fireEvent.click(screen.getByText('确定'));
    // expect(onDelete).toHaveBeenCalledWith(mockRecord);
  })

  it('renders custom actions correctly', () => {
    const customActions = [{ key: 'custom', text: 'Custom Action' }]

    render(
      <ActionButton record={mockRecord} actions={customActions} index={0} />,
    )
    expect(screen.getByText('Custom Action')).toBeDefined()
  })

  it('applies custom render function for buttons', () => {
    const customRenderButton = vi.fn(() => {
      return <button>Custom Button</button>
    })
    const { container } = render(
      <ActionButton
        record={mockRecord}
        renderButton={customRenderButton}
        index={0}
      />,
    )

    expect(customRenderButton).toHaveBeenCalled()
    expect(container.innerHTML).toContain('Custom Button')
  })

  it('handles dynamic maxVisible prop', () => {
    const dynamicMaxVisible = (record: any) => (record.id === 1 ? 2 : 3)
    render(
      <ActionButton
        record={mockRecord}
        maxVisible={dynamicMaxVisible}
        index={0}
      />,
    )

    expect(screen.getByText('查看')).toBeDefined()
    expect(screen.getByText('编辑')).toBeDefined()
    expect(screen.getByText('更多')).toBeDefined()
    expect(screen.queryByText('删除')).toBeNull()
  })
})
