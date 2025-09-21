import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

export function VertexAiLogo(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            role="img"
            aria-label="Vertex AI"
            className={cn("fill-foreground", props.className)}
            {...props}
        >
            <path d="M16.94 6.33a.8.8 0 0 0-.8-.8h-1.6a.8.8 0 0 0-.8.8v3.12a.8.8 0 0 0 .8.8h1.6a.8.8 0 0 0 .8-.8zM12.8 3.93a.8.8 0 0 0-.8-.8h-1.6a.8.8 0 0 0-.8.8v7.92a.8.8 0 0 0 .8.8h1.6a.8.8 0 0 0 .8-.8zM8.66 8.73a.8.8 0 0 0-.8-.8H6.26a.8.8 0 0 0-.8.8v5.32a.8.8 0 0 0 .8.8h1.6a.8.8 0 0 0 .8-.8z" opacity=".6"></path><path d="M12.8 14.85a.8.8 0 0 0-.8-.8h-1.6a.8.8 0 0 0-.8.8v1.52a.8.8 0 0 0 .8.8h1.6a.8.8 0 0 0 .8-.8zM8.66 14.85a.8.8 0 0 0-.8-.8H6.26a.8.8 0 0 0-.8.8v1.52a.8.8 0 0 0 .8.8h1.6a.8.8 0 0 0 .8-.8zM16.94 10.25a.8.8 0 0 0-.8-.8h-1.6a.8.8 0 0 0-.8.8v6.12a.8.8 0 0 0 .8.8h1.6a.8.8 0 0 0 .8-.8z" opacity=".8"></path><path d="m11.5 21.5-5-5a.47.47 0 0 1 0-.7l.9-.9a.47.47 0 0 1 .7 0L12 18.8l3.9-3.9a.47.47 0 0 1 .7 0l.9.9a.47.47 0 0 1 0 .7l-5 5a.47.47 0 0 1-.7 0Z"></path>
        </svg>
    )
}
