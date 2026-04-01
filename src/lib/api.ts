/**
 * CloudBase API 客户端工具
 * 使用服务端代理绕过开发环境的安全域名限制
 */

const API_BASE = '/api/cloudbase';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  requestId?: string;
}

/**
 * 测试 CloudBase 连接
 */
export async function testConnection(): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE}?action=test`);
    const data = await response.json();
    return { data };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * 获取新闻列表
 */
export async function getNews(limit: number = 10): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE}?action=getNews&limit=${limit}`);
    const data = await response.json();
    return { data };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * 获取球房列表
 */
export async function getVenues(limit: number = 10): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE}?action=getVenues&limit=${limit}`);
    const data = await response.json();
    return { data };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * 获取赛事列表
 */
export async function getEvents(limit: number = 10): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE}?action=getEvents&limit=${limit}`);
    const data = await response.json();
    return { data };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * 获取助教列表
 */
export async function getCoaches(limit: number = 10): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE}?action=getCoaches&limit=${limit}`);
    const data = await response.json();
    return { data };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * 通用 POST 请求
 */
export async function postData<T = any>(action: string, data: any): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, data }),
    });
    const result = await response.json();
    return { data: result };
  } catch (error: any) {
    return { error: error.message };
  }
}
