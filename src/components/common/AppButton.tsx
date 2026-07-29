import cn from "clsx";
import { ComponentProps } from "react";
import { Button, ButtonSpinner, ButtonText } from "../ui/button";

type AppButtonProps = {
  children: string;
  className?: string;
  isLoading?: boolean;
} & ComponentProps<typeof Button>;

const AppButton = ({
  className,
  children,
  variant = "default",
  size = "lg",
  isLoading = false,
  ...props
}: AppButtonProps) => {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "min-h-14 rounded-2xl will-change-variable",
        variant === "default" &&
          "bg-lime-400 data-[hover=true]:bg-lime-400/90 data-[active=true]:bg-lime-400/90",
        className,
      )}
      {...props}
    >
      {isLoading && <ButtonSpinner />}
      <ButtonText
        className={cn(
          "text-base font-medium",
          variant === "default" && "text-lime-950",
          variant === "link" && "text-lime-700",
        )}
      >
        {children}
      </ButtonText>
    </Button>
  );
};

export default AppButton;
