import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

/**
 * FormCard - shadcn/ui 컴포넌트를 활용한 카드
 * 기존 atoms/Card와 호환성을 유지하면서 shadcn/ui 스타일 적용
 */
const FormCard = ({
  children,
  title,
  subtitle,
  footer,
  className = "",
  bodyClassName = "",
  headerClassName = "",
  footerClassName = "",
  ...props
}) => {
  return (
    <Card className={className} {...props}>
      {(title || subtitle) && (
        <CardHeader className={headerClassName}>
          {title && <CardTitle>{title}</CardTitle>}
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
        </CardHeader>
      )}

      <CardContent className={bodyClassName}>{children}</CardContent>

      {footer && <CardFooter className={footerClassName}>{footer}</CardFooter>}
    </Card>
  );
};

export default FormCard;
