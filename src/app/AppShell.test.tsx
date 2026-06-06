import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AppShell } from './AppShell'

function renderAt(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AppShell />
    </MemoryRouter>,
  )
}

describe('AppShell routing and UI behavior', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.body.removeAttribute('data-theme')
  })

  it('renders decision framework on deep-link route', () => {
    renderAt('/framework/decision')

    expect(screen.getByRole('heading', { name: 'Decision Framework' })).toBeInTheDocument()
  })

  it('renders a specific pattern page on deep-link route', () => {
    renderAt('/patterns/sliding')

    expect(screen.getByRole('heading', { name: 'Sliding Window — Overview' })).toBeInTheDocument()

    const subPatternCards = screen.getByRole('region', { name: 'Sub-pattern cards' })
    expect(within(subPatternCards).getByRole('link', { name: /Fixed Size/i })).toBeInTheDocument()
    expect(within(subPatternCards).getByRole('link', { name: /Variable — Longest/i })).toBeInTheDocument()
    expect(within(subPatternCards).getByRole('link', { name: /Variable — Shortest/i })).toBeInTheDocument()
    expect(within(subPatternCards).getByRole('link', { name: /At Most K/i })).toBeInTheDocument()
    expect(within(subPatternCards).getByRole('link', { name: /Frequency Map Window/i })).toBeInTheDocument()
  })

  it('renders not-found fallback for unknown pattern ids', () => {
    renderAt('/patterns/not-a-real-pattern')

    expect(screen.getByRole('heading', { name: 'Pattern not found' })).toBeInTheDocument()
  })

  it('restores URL-backed search query on home route', () => {
    renderAt('/?q=window')

    expect(screen.getByRole('searchbox', { name: 'Search patterns' })).toHaveValue('window')
    const patternCards = screen.getByRole('region', { name: 'Pattern cards' })
    expect(within(patternCards).getByRole('link', { name: /Sliding Window/i })).toBeInTheDocument()
    expect(within(patternCards).queryByRole('link', { name: /Trie/i })).not.toBeInTheDocument()
  })

  it('persists theme toggle to localStorage and body attribute', async () => {
    window.localStorage.setItem('dsa-theme', 'light')

    renderAt('/')
    const user = userEvent.setup()

    expect(document.body).toHaveAttribute('data-theme', 'light')

    await user.click(screen.getByRole('button', { name: 'Switch to dark theme' }))

    expect(document.body).toHaveAttribute('data-theme', 'dark')
    expect(window.localStorage.getItem('dsa-theme')).toBe('dark')
  })
})
