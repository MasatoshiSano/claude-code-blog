import Link from "next/link";
import { Badge } from "@/components/ui";

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface TagListProps {
  tags: Tag[];
  variant?: "outline" | "secondary" | "default";
  size?: "sm" | "md" | "lg";
  maxTags?: number;
  showLink?: boolean;
  layout?: "inline" | "wrapped";
  className?: string;
}

export function TagList({
  tags,
  variant = "outline",
  size = "sm",
  maxTags,
  showLink = true,
  layout = "wrapped",
  className = "",
}: TagListProps) {
  const displayTags = maxTags ? tags.slice(0, maxTags) : tags;
  const remainingCount = maxTags && tags.length > maxTags ? tags.length - maxTags : 0;

  const layoutClasses = {
    inline: "flex items-center space-x-2",
    wrapped: "flex flex-wrap gap-2",
  };

  const renderTag = (tag: Tag) => {
    const tagElement = (
      <Badge
        key={tag.id}
        variant={variant}
        size={size}
        className="hover:bg-primary-50 hover:text-primary-700 transition-colors"
      >
        {variant === "default" ? tag.name : `#${tag.name}`}
      </Badge>
    );

    if (!showLink) {
      return tagElement;
    }

    return (
      <Link key={tag.id} href={`/?tag=${tag.slug}`}>
        {tagElement}
      </Link>
    );
  };

  return (
    <div className={`${layoutClasses[layout]} ${className}`}>
      {displayTags.map(renderTag)}
      {remainingCount > 0 && (
        <Badge variant={variant} size={size}>
          +{remainingCount}
        </Badge>
      )}
    </div>
  );
}