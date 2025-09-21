import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

export function GeminiLogo(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            role="img"
            aria-label="Gemini"
            className={cn("fill-foreground", props.className)}
            {...props}
        >
            <path d="M12,2.6L9.4,7.4H4.2l4.2,3-1.6,4.8L11,12.2V21.4h2V12.2l4.2,3-1.6-4.8L20,7.4H14.6Z"/>
        </svg>
    )
}
