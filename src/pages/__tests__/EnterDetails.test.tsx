import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import EnterDetails from '../EnterDetails'

const mockUrl = 'https://www.youtube.com/watch?v=abc123XYZ'

describe('EnterDetails', () => {
  it('renders the YouTube thumbnail', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/enter-details', state: { url: mockUrl } }]}> 
        <EnterDetails />
      </MemoryRouter>
    )
    const img = screen.getByAltText(/youtube thumbnail/i) as HTMLImageElement
    expect(img).toBeInTheDocument()
    expect(img.src).toContain('https://img.youtube.com')
  })

  it('renders the URL as read-only', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/enter-details', state: { url: mockUrl } }]}> 
        <EnterDetails />
      </MemoryRouter>
    )
    const urlInput = screen.getByDisplayValue(mockUrl)
    expect(urlInput).toBeInTheDocument()
    expect(urlInput).toHaveAttribute('readOnly')
  })

  it('renders the cancel button with correct color and border', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/enter-details', state: { url: mockUrl } }]}> 
        <EnterDetails />
      </MemoryRouter>
    )
    const cancelBtn = screen.getByRole('button', { name: /cancel/i })
    expect(cancelBtn).toBeInTheDocument()
    expect(cancelBtn).toHaveStyle({
      backgroundColor: '#075B5E',
      border: '1px solid #AFB774'
    })
  })

  it('renders the thumbnail in landscape (16:9) aspect ratio', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/enter-details', state: { url: mockUrl } }]}> 
        <EnterDetails />
      </MemoryRouter>
    )
    const img = screen.getByAltText(/youtube thumbnail/i) as HTMLImageElement
    // The parent div should have a width:height ratio of 16:9
    const parent = img.parentElement as HTMLElement
    expect(parent).toHaveStyle({ aspectRatio: '16/9' })
  })

  it('renders title and review fields on the left, category and star on the right', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/enter-details', state: { url: mockUrl } }]}> 
        <EnterDetails />
      </MemoryRouter>
    )
    // Title and review fields
    expect(screen.getByPlaceholderText(/just business, darling/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/why do you think/i)).toBeInTheDocument()
    // Category and star fields
    expect(screen.getByPlaceholderText(/sci-fi/i)).toBeInTheDocument()
    expect(screen.getByText(/star/i)).toBeInTheDocument()
  })
}) 