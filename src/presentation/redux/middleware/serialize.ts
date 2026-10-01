import { createSerializableStateInvariantMiddleware } from "@reduxjs/toolkit"

const isSerializable = () => true

export const serializableMiddleware =
  createSerializableStateInvariantMiddleware({
      isSerializable,
  })
