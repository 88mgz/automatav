import { ChecklistRail } from "../skins/ChecklistRail"

interface KeyTakeawaysProps {
  items: string[]
}

export function KeyTakeaways({ items }: KeyTakeawaysProps) {
  return <ChecklistRail items={items} />
}
