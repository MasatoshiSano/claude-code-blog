/**
 * フロントエンドとバックエンドの統合テストスクリプト
 */

const fetch = require('node-fetch');

const FRONTEND_URL = 'http://localhost:3003';
const BACKEND_URL = 'http://localhost:8000/api';

// テスト結果を記録
const testResults = [];

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
  console.log(logMessage);
  
  testResults.push({
    timestamp,
    type,
    message
  });
}

// APIエンドポイントのテスト
async function testApiEndpoint(name, url, expectedStatus = 200) {
  try {
    log(`Testing ${name}: ${url}`);
    const response = await fetch(url);
    
    if (response.status === expectedStatus) {
      log(`✅ ${name} - Status: ${response.status}`, 'success');
      return true;
    } else {
      log(`❌ ${name} - Expected: ${expectedStatus}, Got: ${response.status}`, 'error');
      return false;
    }
  } catch (error) {
    log(`❌ ${name} - Error: ${error.message}`, 'error');
    return false;
  }
}

// バックエンドAPIの基本テスト
async function testBackendApi() {
  log('=== バックエンドAPI テスト ===');
  
  const tests = [
    ['Blog Posts', `${BACKEND_URL}/blog/posts/`],
    ['Categories', `${BACKEND_URL}/blog/categories/`],
    ['Tags', `${BACKEND_URL}/blog/tags/`],
    ['Authors', `${BACKEND_URL}/blog/authors/`],
    ['Comments', `${BACKEND_URL}/blog/comments/`],
    ['JWT Token Endpoint', `${BACKEND_URL}/auth/jwt/token/`, 405], // Method not allowed for GET
  ];
  
  let passed = 0;
  for (const [name, url, expectedStatus] of tests) {
    if (await testApiEndpoint(name, url, expectedStatus)) {
      passed++;
    }
  }
  
  log(`バックエンドAPIテスト結果: ${passed}/${tests.length} passed`);
  return passed === tests.length;
}

// フロントエンドのテスト
async function testFrontend() {
  log('=== フロントエンド テスト ===');
  
  const tests = [
    ['Home Page', `${FRONTEND_URL}/`],
    ['Blog Page', `${FRONTEND_URL}/blog`],
    ['Contact Page', `${FRONTEND_URL}/contact`],
    ['Search Page', `${FRONTEND_URL}/search`],
    ['API Route - NextAuth', `${FRONTEND_URL}/api/auth/providers`],
  ];
  
  let passed = 0;
  for (const [name, url] of tests) {
    if (await testApiEndpoint(name, url)) {
      passed++;
    }
  }
  
  log(`フロントエンドテスト結果: ${passed}/${tests.length} passed`);
  return passed === tests.length;
}

// データ整合性テスト
async function testDataIntegrity() {
  log('=== データ整合性 テスト ===');
  
  try {
    // ブログ記事の取得
    const postsResponse = await fetch(`${BACKEND_URL}/blog/posts/`);
    const postsData = await postsResponse.json();
    
    if (postsData.results && postsData.results.length > 0) {
      log(`✅ ブログ記事データ - ${postsData.results.length}件の記事が存在`);
      
      // 最初の記事の詳細チェック
      const firstPost = postsData.results[0];
      const requiredFields = ['id', 'title', 'slug', 'content', 'author', 'category', 'published_at'];
      
      let fieldsPassed = 0;
      for (const field of requiredFields) {
        if (firstPost[field]) {
          fieldsPassed++;
        } else {
          log(`❌ 必須フィールド不足: ${field}`, 'error');
        }
      }
      
      log(`記事フィールドチェック: ${fieldsPassed}/${requiredFields.length} passed`);
      
      // カテゴリの整合性チェック
      const categoriesResponse = await fetch(`${BACKEND_URL}/blog/categories/`);
      const categoriesData = await categoriesResponse.json();
      
      if (categoriesData.results && categoriesData.results.length > 0) {
        log(`✅ カテゴリデータ - ${categoriesData.results.length}件のカテゴリが存在`);
      } else {
        log(`❌ カテゴリデータなし`, 'error');
      }
      
      return true;
    } else {
      log(`❌ ブログ記事データなし`, 'error');
      return false;
    }
  } catch (error) {
    log(`❌ データ整合性テスト失敗: ${error.message}`, 'error');
    return false;
  }
}

// CORS設定のテスト
async function testCorsSettings() {
  log('=== CORS設定 テスト ===');
  
  try {
    const response = await fetch(`${BACKEND_URL}/blog/posts/`, {
      method: 'OPTIONS',
      headers: {
        'Origin': FRONTEND_URL,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
    };
    
    let corsValid = true;
    
    if (!corsHeaders['Access-Control-Allow-Origin']) {
      log(`❌ CORS: Access-Control-Allow-Origin ヘッダーなし`, 'error');
      corsValid = false;
    } else {
      log(`✅ CORS: Access-Control-Allow-Origin = ${corsHeaders['Access-Control-Allow-Origin']}`);
    }
    
    if (!corsHeaders['Access-Control-Allow-Methods']) {
      log(`❌ CORS: Access-Control-Allow-Methods ヘッダーなし`, 'error');
      corsValid = false;
    } else {
      log(`✅ CORS: Access-Control-Allow-Methods = ${corsHeaders['Access-Control-Allow-Methods']}`);
    }
    
    return corsValid;
  } catch (error) {
    log(`❌ CORS設定テスト失敗: ${error.message}`, 'error');
    return false;
  }
}

// メイン実行関数
async function runIntegrationTests() {
  log('🚀 統合テスト開始');
  
  const results = {
    backend: await testBackendApi(),
    frontend: await testFrontend(),
    dataIntegrity: await testDataIntegrity(),
    cors: await testCorsSettings()
  };
  
  log('=== 統合テスト結果 ===');
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  for (const [test, result] of Object.entries(results)) {
    log(`${result ? '✅' : '❌'} ${test}: ${result ? 'PASS' : 'FAIL'}`);
  }
  
  log(`\n🎯 全体結果: ${passed}/${total} テストが合格`);
  
  if (passed === total) {
    log('🎉 すべての統合テストが成功しました！', 'success');
    process.exit(0);
  } else {
    log('❌ 一部のテストが失敗しました', 'error');
    process.exit(1);
  }
}

// 実行
if (require.main === module) {
  runIntegrationTests().catch(error => {
    log(`💥 統合テスト実行中にエラー: ${error.message}`, 'error');
    process.exit(1);
  });
}

module.exports = {
  runIntegrationTests,
  testResults
};