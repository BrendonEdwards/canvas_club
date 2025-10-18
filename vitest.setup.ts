import React from 'react'
import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...rest }: { src: string; alt: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...rest} />
  },
}))
