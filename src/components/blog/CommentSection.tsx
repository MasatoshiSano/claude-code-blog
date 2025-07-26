"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Button, Input, Textarea, LoadingSpinner } from "@/components/ui";
import { CommentSectionProps, NewComment } from "@/types";
import { NewCommentSchema } from "@/lib/schemas";
import { formatDateTime } from "@/lib/utils";

const CommentSection = ({
  postId,
  comments,
  onAddComment,
}: CommentSectionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewComment>({
    resolver: zodResolver(NewCommentSchema),
    defaultValues: {
      postId,
    },
  });

  const onSubmit = async (data: NewComment) => {
    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      await onAddComment(data);
      reset({ postId, author: "", email: "", content: "" });
      setSubmitSuccess(true);

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("コメントの送信に失敗しました:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-8">
      <div>
        <h3 className="text-2xl font-semibold text-neutral-900 mb-6">
          コメント ({comments.length})
        </h3>

        {comments.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-neutral-600">
              まだコメントがありません。最初のコメントを投稿してみませんか？
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <Card key={comment.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-neutral-900">
                      {comment.author}
                    </h4>
                    <p className="text-sm text-neutral-500">
                      {formatDateTime(comment.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Card className="p-6">
        <h4 className="text-lg font-semibold text-neutral-900 mb-4">
          コメントを投稿
        </h4>

        {submitSuccess && (
          <div className="mb-4 p-3 bg-green-100 border border-green-200 rounded-md">
            <p className="text-green-800 text-sm">
              コメントが送信されました。承認後に表示されます。
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("postId")} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="お名前"
              placeholder="山田太郎"
              error={errors.author?.message}
              required
              {...register("author")}
            />
            <Input
              label="メールアドレス"
              type="email"
              placeholder="example@example.com"
              error={errors.email?.message}
              required
              {...register("email")}
            />
          </div>

          <Textarea
            label="コメント"
            placeholder="記事の感想やご意見をお聞かせください..."
            rows={4}
            error={errors.content?.message}
            required
            {...register("content")}
          />

          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-500">
              ※ コメントは承認後に表示されます
            </p>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  送信中...
                </>
              ) : (
                "コメントを投稿"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
};

export default CommentSection;
