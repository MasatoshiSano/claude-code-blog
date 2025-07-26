'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Input, Textarea, Container, CategoryBadge, TagList } from '@/components/ui';
import { mockCategories, mockTags } from '@/data/mockData';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import matter from 'gray-matter';

interface PostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryId: string;
  tagIds: string[];
  featuredImage?: string;
}

interface FrontMatter {
  title?: string;
  slug?: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  featuredImage?: string;
}

export default function AddPostPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    categoryId: '',
    tagIds: [],
  });
  const [markdownFile, setMarkdownFile] = useState<File | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/markdown') {
      setMarkdownFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const { data: frontMatter, content: markdownContent } = matter(content);
        
        // フロントマターから情報を抽出
        const fm = frontMatter as FrontMatter;
        const categoryId = mockCategories.find(cat => 
          cat.name === fm.category || cat.slug === fm.category
        )?.id || '';
        
        const tagIds = fm.tags?.map(tagName => 
          mockTags.find(tag => tag.name === tagName || tag.slug === tagName)?.id
        ).filter(Boolean) as string[] || [];

        setFormData({
          title: fm.title || '',
          slug: fm.slug || '',
          excerpt: fm.excerpt || '',
          content: markdownContent,
          categoryId,
          tagIds,
          featuredImage: fm.featuredImage,
        });
      };
      reader.readAsText(file);
    }
  }, []);

  const handleInputChange = (field: keyof PostFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagToggle = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter(id => id !== tagId)
        : [...prev.tagIds, tagId]
    }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    handleInputChange('title', title);
    if (!formData.slug) {
      handleInputChange('slug', generateSlug(title));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '記事の保存に失敗しました');
      }

      console.log('記事が保存されました:', data);
      router.push('/');
    } catch (error) {
      console.error('記事の保存に失敗しました:', error);
      alert(error instanceof Error ? error.message : '記事の保存に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCategory = mockCategories.find(cat => cat.id === formData.categoryId);
  const selectedTags = mockTags.filter(tag => formData.tagIds.includes(tag.id));

  return (
    <Container className="py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">新しい記事を追加</h1>
          <p className="text-neutral-600">Markdownファイルをアップロードするか、直接入力して記事を作成できます。</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 入力フォーム */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">記事情報</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* ファイルアップロード */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Markdownファイル
                  </label>
                  <input
                    type="file"
                    accept=".md,.markdown"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                  {markdownFile && (
                    <p className="mt-1 text-sm text-neutral-500">
                      アップロード済み: {markdownFile.name}
                    </p>
                  )}
                </div>

                {/* タイトル */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    タイトル *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="記事のタイトルを入力"
                    required
                  />
                </div>

                {/* スラッグ */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    スラッグ *
                  </label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="url-friendly-slug"
                    required
                  />
                </div>

                {/* 抜粋 */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    抜粋 *
                  </label>
                  <Textarea
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    placeholder="記事の要約を入力"
                    rows={3}
                    required
                  />
                </div>

                {/* カテゴリ */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    カテゴリ *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => handleInputChange('categoryId', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">カテゴリを選択</option>
                    {mockCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {selectedCategory && (
                    <div className="mt-2">
                      <CategoryBadge category={selectedCategory} variant="pill" size="sm" showLink={false} />
                    </div>
                  )}
                </div>

                {/* タグ */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    タグ
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-neutral-200 rounded-md p-3">
                    {mockTags.map(tag => (
                      <label key={tag.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.tagIds.includes(tag.id)}
                          onChange={() => handleTagToggle(tag.id)}
                          className="text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-neutral-700">{tag.name}</span>
                      </label>
                    ))}
                  </div>
                  {selectedTags.length > 0 && (
                    <div className="mt-2">
                      <TagList tags={selectedTags} variant="outline" size="sm" showLink={false} />
                    </div>
                  )}
                </div>

                {/* アイキャッチ画像 */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    アイキャッチ画像URL
                  </label>
                  <Input
                    value={formData.featuredImage || ''}
                    onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    type="url"
                  />
                </div>

                {/* 記事本文 */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    記事本文 *
                  </label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Markdownで記事を書いてください..."
                    rows={20}
                    className="font-mono text-sm"
                    required
                  />
                </div>

                {/* ボタン */}
                <div className="flex space-x-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsPreview(!isPreview)}
                  >
                    {isPreview ? '編集' : 'プレビュー'}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? '保存中...' : '記事を保存'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* プレビュー */}
          <div className="lg:sticky lg:top-8">
            <Card className="p-6 h-fit">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">プレビュー</h2>
              
              {isPreview && formData.content ? (
                <div className="prose prose-sm max-w-none">
                  <h1>{formData.title}</h1>
                  <p className="text-neutral-600 italic">{formData.excerpt}</p>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {formData.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-500">
                  <p>プレビューボタンをクリックして記事をプレビューできます</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
}