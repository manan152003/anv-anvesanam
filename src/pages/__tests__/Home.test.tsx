import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '../Home'

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