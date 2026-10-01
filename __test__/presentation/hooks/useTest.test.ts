import { renderHook, act } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { useTest } from "@/presentation/hooks/useTest"

describe("useTest", () => {
  it("returns handleTest function", () => {
    const { result } = renderHook(() => useTest())
    expect(result.current.handleTest).toBeDefined()
    expect(typeof result.current.handleTest).toBe("function")
  })

  it("logs 'test' when handleTest is called", () => {
    const consoleLogSpy = vi.spyOn(console, "log")
    const { result } = renderHook(() => useTest())

    act(() => {
      result.current.handleTest()
    })

    expect(consoleLogSpy).toHaveBeenCalledWith("test")
    expect(consoleLogSpy).toHaveBeenCalledTimes(1)

    consoleLogSpy.mockRestore()
  })

  it("can call handleTest multiple times", () => {
    const consoleLogSpy = vi.spyOn(console, "log")
    const { result } = renderHook(() => useTest())

    act(() => {
      result.current.handleTest()
      result.current.handleTest()
      result.current.handleTest()
    })

    expect(consoleLogSpy).toHaveBeenCalledTimes(3)
    consoleLogSpy.mockRestore()
  })
})
