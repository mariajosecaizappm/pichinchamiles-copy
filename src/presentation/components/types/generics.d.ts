import { SelectItemProps } from "@heroui/react"

declare global {
  type SelectOption = Pick<SelectItemProps, "key"> & {
    label: string
  }
}
