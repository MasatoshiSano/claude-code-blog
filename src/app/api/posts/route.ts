import { NextRequest, NextResponse } from 'next/server';
import { BlogPost } from '@/types';
import { mockBlogPosts, mockAuthors, mockCategories, mockTags } from '@/data/mockData';

// POST: 新しい記事を作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      title,
      slug,
      excerpt,
      content,
      categoryId,
      tagIds,
      featuredImage
    } = body;

    // バリデーション
    if (!title || !slug || !excerpt || !content || !categoryId) {
      return NextResponse.json(
        { error: '必須フィールドが不足しています' },
        { status: 400 }
      );
    }

    // スラッグの重複チェック
    const existingPost = mockBlogPosts.find(post => post.slug === slug);
    if (existingPost) {
      return NextResponse.json(
        { error: 'このスラッグは既に使用されています' },
        { status: 409 }
      );
    }

    // 新しい記事を作成
    const newPost: BlogPost = {
      id: (mockBlogPosts.length + 1).toString(),
      title,
      slug,
      excerpt,
      content,
      category: mockCategories.find(cat => cat.id === categoryId)!,
      tags: mockTags.filter(tag => tagIds.includes(tag.id)),
      author: mockAuthors[0], // デフォルトの著者
      featuredImage: featuredImage || null,
      publishedAt: new Date(),
      updatedAt: new Date(),
      status: 'published',
      viewCount: 0,
      seo: {
        metaTitle: title,
        metaDescription: excerpt,
        keywords: [],
      }
    };

    // モックデータに追加（実際のアプリではデータベースに保存）
    mockBlogPosts.unshift(newPost);

    return NextResponse.json(
      { message: '記事が正常に作成されました', post: newPost },
      { status: 201 }
    );

  } catch (error) {
    console.error('記事作成エラー:', error);
    return NextResponse.json(
      { error: '記事の作成に失敗しました' },
      { status: 500 }
    );
  }
}

// GET: 記事一覧を取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');

    let filteredPosts = [...mockBlogPosts];

    // フィルタリング
    if (category) {
      filteredPosts = filteredPosts.filter(post => 
        post.category.slug === category
      );
    }

    if (tag) {
      filteredPosts = filteredPosts.filter(post =>
        post.tags.some(t => t.slug === tag)
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower)
      );
    }

    // ページネーション
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    return NextResponse.json({
      posts: paginatedPosts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredPosts.length / limit),
        totalItems: filteredPosts.length,
        itemsPerPage: limit,
      }
    });

  } catch (error) {
    console.error('記事取得エラー:', error);
    return NextResponse.json(
      { error: '記事の取得に失敗しました' },
      { status: 500 }
    );
  }
}