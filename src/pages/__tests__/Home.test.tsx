import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import Home from '../Home'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

describe('Home', () => {
  it('renders the main heading', () => {
    render(<Home />)
    expect(screen.getByText('Feeling Bored')).toBeInTheDocument()
  })

  it('renders the tagline', () => {
    render(<Home />)
    expect(screen.getByText('Discover videos worth your time')).toBeInTheDocument()
  })

  it('renders the URL input field', () => {
    render(<Home />)
    expect(screen.getByPlaceholderText('Paste YouTube URL here...')).toBeInTheDocument()
  })

  it('renders the Add Video button', () => {
    render(<Home />)
    expect(screen.getByText('Add Video')).toBeInTheDocument()
  })

  it('renders the logo', () => {
    render(<Home />)
    expect(screen.getByAltText('Anv Logo')).toBeInTheDocument()
  })
})

describe('Home page YouTube URL logic', () => {
  it('shows error for invalid YouTube URL', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'not a youtube url' } })
    const button = screen.getByRole('button', { name: /add video/i })
    fireEvent.click(button)
    expect(screen.getByText(/please enter a valid youtube url/i)).toBeInTheDocument()
  })

  it('redirects to /enter-details for valid YouTube URL', () => {
    const navigate = vi.fn()
    vi.mocked(useNavigate).mockReturnValue(navigate)
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'https://www.youtube.com/watch?v=abc123' } })
    const button = screen.getByRole('button', { name: /add video/i })
    fireEvent.click(button)
    expect(navigate).toHaveBeenCalledWith('/enter-details', { state: { url: 'https://www.youtube.com/watch?v=abc123' } })
  })
}) 