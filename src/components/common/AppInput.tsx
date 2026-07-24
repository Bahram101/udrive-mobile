import cn from "clsx";
import { ComponentProps } from "react";

import { Input, InputField } from "../ui/input";

type AppInputProps = ComponentProps<typeof InputField> & {
  className?: string;
};

const AppInput = ({ className, ...props }: AppInputProps) => {
  return (
    <Input className="h-14 rounded-2xl bg-muted px-4">
      <InputField className={cn("text-base", className)} {...props} />
    </Input>
  );
};

export default AppInput;
