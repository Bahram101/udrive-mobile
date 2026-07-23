import cn from "clsx";
import { ComponentProps } from "react";
import { Button, ButtonText } from "../ui/button";

type AppButtonProps = {
  children: string;
  className?: string;
} & ComponentProps<typeof Button>;

const AppButton = ({ className, children, ...props }: AppButtonProps) => {
  return (
    <Button
      className={cn(
        "p-5 rounded-2xl bg-emerald-700 data-[active=true]:bg-emerald-600",
        className,
      )}
      {...props}
    >
      <ButtonText className="text-base font-medium">{children}</ButtonText>
    </Button>
  );
};

export default AppButton;
