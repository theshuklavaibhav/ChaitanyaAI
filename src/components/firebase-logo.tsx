import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

export function FirebaseLogo(props: SVGProps<SVGSVGElement>) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 144 200"
            role="img"
            aria-label="Firebase"
            className={cn("fill-foreground", props.className)}
            {...props}
        >
            <path d="m92.3 0-92.3 129.5 35 35.2 57.3-80.3v-84.4z"/>
            <path d="m0 164.7 35 35.3h109l-35-35.3z" />
            <path d="m92.3 33.3-35 48.9 35 35.3v-84.2z" />
        </svg>
    )
}
