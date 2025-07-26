import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, Badge, Button } from "@/components/ui";
import { Author, SocialLink } from "@/types";

type AuthorCardVariant = "default" | "compact" | "featured";
type AuthorCardLayout = "vertical" | "horizontal";

interface AuthorCardProps {
  author: Author;
  variant?: AuthorCardVariant;
  layout?: AuthorCardLayout;
  showBio?: boolean;
  showPostCount?: boolean;
  showSocialLinks?: boolean;
  showFollowButton?: boolean;
  postCount?: number;
  className?: string;
  actions?: ReactNode;
  linkProps?: {
    href?: string;
    onClick?: () => void;
  };
}

const AuthorCard = ({
  author,
  variant = "default",
  layout = "vertical",
  showBio = true,
  showPostCount = true,
  showSocialLinks = true,
  showFollowButton = false,
  postCount,
  className = "",
  actions,
  linkProps,
}: AuthorCardProps) => {
  const href = linkProps?.href || `/author/${author.id}`;
  
  const getCardClasses = () => {
    const baseClasses = "transition-all duration-300";
    
    const variantClasses = {
      default: "hover:shadow-lg hover:-translate-y-1",
      compact: "hover:shadow-md",
      featured: "border-2 border-primary-200 hover:border-primary-300 hover:shadow-xl",
    };

    return `${baseClasses} ${variantClasses[variant]} ${className}`;
  };

  const getAvatarSize = () => {
    switch (variant) {
      case "compact":
        return { width: 48, height: 48 };
      case "featured":
        return { width: 96, height: 96 };
      default:
        return { width: 64, height: 64 };
    }
  };

  const avatarSize = getAvatarSize();
  const isHorizontal = layout === "horizontal";

  const renderAvatar = () => (
    <div className={`relative ${isHorizontal ? "flex-shrink-0" : "mx-auto"}`}>
      <Image
        src={author.avatar || '/images/default-avatar.png'}
        alt={author.name}
        width={avatarSize.width}
        height={avatarSize.height}
        className="rounded-full object-cover"
      />
      {variant === "featured" && (
        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 border-2 border-white rounded-full" />
      )}
    </div>
  );

  const renderContent = () => (
    <div className={`${isHorizontal ? "flex-1 ml-4" : "text-center mt-4"}`}>
      <h3 className={`font-semibold text-neutral-900 ${
        variant === "featured" ? "text-xl" : variant === "compact" ? "text-base" : "text-lg"
      }`}>
        {author.name}
      </h3>
      
      {showBio && author.bio && variant !== "compact" && (
        <p className={`text-neutral-600 mt-2 ${
          variant === "featured" ? "text-base" : "text-sm"
        } ${
          isHorizontal ? "line-clamp-2" : "line-clamp-3"
        }`}>
          {author.bio}
        </p>
      )}

      <div className={`flex items-center gap-4 mt-3 ${
        isHorizontal ? "justify-start" : "justify-center"
      }`}>
        {showPostCount && (
          <Badge variant="secondary" size="sm">
            {postCount || author.articlesCount || 0} 記事
          </Badge>
        )}
        
        {showSocialLinks && author.socialLinks && author.socialLinks.length > 0 && (
          <div className="flex space-x-2">
            {author.socialLinks.slice(0, 3).map((link: SocialLink, index: number) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-neutral-500 hover:text-primary-600 transition-colors"
                aria-label={link.platform}
              >
                <div className="w-4 h-4">
                  <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {showFollowButton && (
        <div className="mt-4">
          <Button size="sm" variant="outline" fullWidth={!isHorizontal}>
            フォロー
          </Button>
        </div>
      )}

      {actions && (
        <div className="mt-4">
          {actions}
        </div>
      )}
    </div>
  );

  const content = (
    <div className={isHorizontal ? "flex items-start" : ""}>
      {renderAvatar()}
      {renderContent()}
    </div>
  );

  if (linkProps?.onClick || !href) {
    return (
      <Card 
        className={getCardClasses()}
        hover={variant !== "compact"}
        onClick={linkProps?.onClick}
        padding={variant === "compact" ? "sm" : "md"}
      >
        {content}
      </Card>
    );
  }

  return (
    <Card 
      className={getCardClasses()} 
      hover={variant !== "compact"}
      padding={variant === "compact" ? "sm" : "md"}
    >
      <Link href={href} className="block">
        {content}
      </Link>
    </Card>
  );
};

export { AuthorCard, type AuthorCardProps };
export default AuthorCard;