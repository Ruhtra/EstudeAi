import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    // const inputRef = React.useRef<HTMLInputElement>(null);

    // const applyMask = React.useCallback((value: string, mask: string) => {
    //   let maskedValue = "";
    //   let valueIndex = 0;

    //   for (let i = 0; i < mask.length; i++) {
    //     if (valueIndex >= value.length) break;

    //     if (mask[i] === "x") {
    //       maskedValue += value[valueIndex];
    //       valueIndex++;
    //     } else {
    //       maskedValue += mask[i];
    //       if (value[valueIndex] === mask[i]) valueIndex++;
    //     }
    //   }

    //   return maskedValue;
    // }, []);

    // const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
    //   const input = event.target as HTMLInputElement;
    //   if (mask) {
    //     const unmaskedValue = input.value.replace(/[^\d]/g, "");
    //     input.value = applyMask(unmaskedValue, mask);
    //   }
    // };

    // React.useEffect(() => {
    //   if (mask && inputRef.current && props.value) {
    //     const unmaskedValue = String(props.value).replace(/[^\d]/g, "");
    //     inputRef.current.value = applyMask(unmaskedValue, mask);
    //   }
    // }, [mask, props.value, applyMask]);

    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        // ref={(node) => {
        //   inputRef.current = node;
        //   if (typeof ref === "function") {
        //     ref(node);
        //   } else if (ref) {
        //     ref.current = node;
        //   }
        // }}
        // onInput={handleInput}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
