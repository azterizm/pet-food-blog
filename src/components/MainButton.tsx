import type { ButtonHTMLAttributes, ReactElement, ReactNode } from "react"

export interface MainButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children:ReactNode
}

export function MainButton(props: MainButtonProps): ReactElement {
	return (
		<button className={"px-5 py-3 font-bold text-lg bg-primary border-none c-white rounded-full " + props.className} {...props}>
			{props.children}
		</button>
	)
}
