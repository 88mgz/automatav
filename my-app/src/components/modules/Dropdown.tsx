import { RailOnly } from "../skins/RailOnly"

interface DropdownProps {
  items: Array<{
    title: string
    body: string
  }>
}

export function Dropdown({ items }: DropdownProps) {
  const railItems = items.map((item) => ({ q: item.title, a: item.body }))
  return <RailOnly items={railItems} />
}
