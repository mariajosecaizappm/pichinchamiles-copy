import "reflect-metadata"
import "@testing-library/jest-dom"
import React from "react"
import {beforeAll, afterEach, afterAll, vi} from "vitest"
import { server } from "./__mocks__/server"
import { mockTrack } from "./__test__/utils/analytics"

globalThis.React = React

vi.mock("@iconify/react", () => ({
    Icon: ({
        icon,
        className,
        ...props
    }: {
    icon: string
    className?: string
    [key: string]: unknown
  }) =>
        React.createElement("span", {
            "data-testid": "iconify-icon",
            "data-icon": icon,
            className,
            ...props,
        }),
}))

vi.mock("@/presentation/hooks/useAnalytics", () => ({
  default: () => ({
    track: mockTrack,
  }),
}))

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  root: any = null
  rootMargin: string = ''
  thresholds: ReadonlyArray<number> = []
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return [] }
}

// Set environment variables for testing
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000'
process.env.NEXT_PUBLIC_CLIENT_ID = 'test-client-id'
process.env.NEXT_PUBLIC_PROGRAM_ID = 'test-program-id'

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  mockTrack.mockReset()
})
afterAll(() => server.close())
