import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  href?: string;
  variant?: "text" | "image" | "combined";
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  subtext?: string;
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  icon?: ReactNode;
  className?: string;
  textClassName?: string;
  imageClassName?: string;
}

const Logo = ({
  href = "/",
  variant = "text", 
  size = "md",
  text = "Blog",
  subtext = "Site",
  image,
  icon,
  className,
  textClassName,
  imageClassName,
}: LogoProps) => {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl", 
    lg: "text-3xl",
    xl: "text-4xl",
  };

  const imageSizes = {
    sm: { width: 24, height: 24 },
    md: { width: 32, height: 32 },
    lg: { width: 40, height: 40 },
    xl: { width: 48, height: 48 },
  };

  const LogoContent = () => {
    switch (variant) {
      case "image":
        return (
          <div className="flex items-center">
            {image ? (
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width || imageSizes[size].width}
                height={image.height || imageSizes[size].height}
                className={cn("object-contain", imageClassName)}
              />
            ) : icon ? (
              <div className={cn("flex items-center justify-center", imageClassName)}>
                {icon}
              </div>
            ) : (
              <div className={cn(
                "rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold",
                imageClassName
              )} 
              style={{ 
                width: imageSizes[size].width, 
                height: imageSizes[size].height 
              }}>
                {text.charAt(0)}
              </div>
            )}
          </div>
        );

      case "combined":
        return (
          <div className="flex items-center space-x-3">
            {image ? (
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width || imageSizes[size].width}
                height={image.height || imageSizes[size].height}
                className={cn("object-contain", imageClassName)}
              />
            ) : icon ? (
              <div className={cn("flex items-center justify-center", imageClassName)}>
                {icon}
              </div>
            ) : (
              <div className={cn(
                "rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold",
                imageClassName
              )} 
              style={{ 
                width: imageSizes[size].width, 
                height: imageSizes[size].height 
              }}>
                {text.charAt(0)}
              </div>
            )}
            <div className="flex flex-col">
              <span className={cn(
                "font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent",
                sizeClasses[size],
                textClassName
              )}>
                {text}
              </span>
              {subtext && (
                <span className={cn(
                  "text-neutral-600 font-medium",
                  size === "xl" ? "text-lg" : size === "lg" ? "text-base" : "text-sm"
                )}>
                  {subtext}
                </span>
              )}
            </div>
          </div>
        );

      case "text":
      default:
        return (
          <div className="flex items-baseline">
            <span className={cn(
              "font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent",
              sizeClasses[size],
              textClassName
            )}>
              {text}
            </span>
            {subtext && (
              <span className={cn(
                "font-bold text-neutral-800 ml-1",
                sizeClasses[size],
                textClassName
              )}>
                {subtext}
              </span>
            )}
          </div>
        );
    }
  };

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center hover:opacity-80 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-lg",
        className
      )}
    >
      <LogoContent />
    </Link>
  );
};

export { Logo, type LogoProps };
export default Logo;