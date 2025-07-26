"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Button, Input, Textarea, LoadingSpinner } from "@/components/ui";
import { ContactForm } from "@/types";
import { ContactFormSchema } from "@/lib/schemas";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(ContactFormSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("お問い合わせデータ:", data);

      setSubmitSuccess(true);
      reset();

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      setSubmitError(
        "送信中にエラーが発生しました。しばらく時間をおいて再度お試しください。",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">
            お問い合わせ
          </h1>
          <p className="text-neutral-600">
            ご質問やご要望がございましたら、下記のフォームからお気軽にお問い合わせください。
            内容を確認後、できるだけ早めにご返信いたします。
          </p>
        </div>

        <Card className="p-8">
          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-100 border border-green-200 rounded-md">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-600 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-green-800 font-medium">
                  お問い合わせありがとうございます！
                </p>
              </div>
              <p className="text-green-700 text-sm mt-2">
                内容を確認後、ご連絡いたします。しばらくお待ちください。
              </p>
            </div>
          )}

          {submitError && (
            <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-md">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-red-600 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-red-800 text-sm">{submitError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="お名前"
                placeholder="山田 太郎"
                error={errors.name?.message}
                required
                {...register("name")}
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

            <Input
              label="件名"
              placeholder="お問い合わせの件名をご入力ください"
              error={errors.subject?.message}
              required
              {...register("subject")}
            />

            <Textarea
              label="メッセージ"
              placeholder="お問い合わせ内容を詳しくご記入ください..."
              rows={6}
              error={errors.message?.message}
              required
              {...register("message")}
            />

            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-500">
                ※
                個人情報は適切に管理し、お問い合わせ対応以外には使用いたしません
              </p>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    送信中...
                  </>
                ) : (
                  "送信する"
                )}
              </Button>
            </div>
          </form>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
          <Card className="p-6">
            <div className="text-primary-600 mb-3">
              <svg
                className="w-8 h-8 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-neutral-900 mb-2">
              メールでのお問い合わせ
            </h3>
            <p className="text-sm text-neutral-600">
              フォームからのお問い合わせが難しい場合は、直接メールでお問い合わせください。
            </p>
          </Card>

          <Card className="p-6">
            <div className="text-primary-600 mb-3">
              <svg
                className="w-8 h-8 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-neutral-900 mb-2">
              返信について
            </h3>
            <p className="text-sm text-neutral-600">
              通常1-2営業日以内にご返信いたします。お急ぎの場合はその旨をお知らせください。
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
