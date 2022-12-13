import * as Icons from 'phosphor-react'
import type { ReactElement, RefAttributes } from 'react'

export interface RenderIconByNameProps
  extends Icons.IconProps,
    RefAttributes<SVGSVGElement> {
  name: string
}

export function RenderIconByName(props: RenderIconByNameProps): ReactElement {
  const Component = (Icons as any)[props.name]
  return <Component {...props} />
}
