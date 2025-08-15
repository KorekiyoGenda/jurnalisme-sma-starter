"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import articlesData from '@/data/articles-dashboard.json';
import usersData from '@/data/users.json';
import categoriesData from '@/data/categories.json';
import mediaData from '@/data/media.json';

export interface Article {
  id: string;
  title: string;
  slug: string;
  status: 'Draft' | 'In Review' | 'Scheduled' | 'Published' | 'Archived';
  category: string;
  tags: string[];
  author: string;
  content: string;
  excerpt: string;
  featured_image: string;
  views: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'member' | 'writer' | 'editor' | 'admin';
  avatar: string;
  articles: number;
  bio: string;
  joinedAt: string;
  lastActive: string;
  status: 'active' | 'inactive';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  articleCount: number;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  id: string;
  filename: string;
  original_name: string;
  alt: string;
  type: string;
  size: number;
  dimensions: { width: number; height: number };
  url: string;
  thumbnail: string;
  usedIn: string[];
  uploadedAt: string;
  uploadedBy: string;
}

export interface Settings {
  site_name: string;
  tagline: string;
  brand_primary: string;
  review_required: boolean;
  default_status: 'Draft' | 'In Review' | 'Published';
  comments_enabled: boolean;
  auto_moderation: boolean;
}

interface AdminStore {
  articles: Article[];
  users: User[];
  categories: Category[];
  media: Media[];
  settings: Settings;
  sidebarCollapsed: boolean;
  
  // Actions
  setArticles: (articles: Article[]) => void;
  addArticle: (article: Article) => void;
  updateArticle: (id: string, article: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  bulkUpdateArticles: (ids: string[], update: Partial<Article>) => void;
  
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  setMedia: (media: Media[]) => void;
  addMedia: (media: Media) => void;
  deleteMedia: (id: string) => void;
  
  updateSettings: (settings: Partial<Settings>) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      articles: articlesData as Article[],
      users: usersData as User[],
      categories: categoriesData as Category[],
      media: mediaData as Media[],
      settings: {
        site_name: 'SMA N 7 Journalism',
        tagline: 'Berkarya Melalui Tulisan',
        brand_primary: '#EF4444',
        review_required: true,
        default_status: 'Draft',
        comments_enabled: true,
        auto_moderation: true,
      },
      sidebarCollapsed: false,

      setArticles: (articles) => set({ articles }),
      addArticle: (article) => set((state) => ({
        articles: [article, ...state.articles]
      })),
      updateArticle: (id, update) => set((state) => ({
        articles: state.articles.map((article) =>
          article.id === id ? { ...article, ...update } : article
        )
      })),
      deleteArticle: (id) => set((state) => ({
        articles: state.articles.filter((article) => article.id !== id)
      })),
      bulkUpdateArticles: (ids, update) => set((state) => ({
        articles: state.articles.map((article) =>
          ids.includes(article.id) ? { ...article, ...update } : article
        )
      })),

      setUsers: (users) => set({ users }),
      addUser: (user) => set((state) => ({
        users: [user, ...state.users]
      })),
      updateUser: (id, update) => set((state) => ({
        users: state.users.map((user) =>
          user.id === id ? { ...user, ...update } : user
        )
      })),
      deleteUser: (id) => set((state) => ({
        users: state.users.filter((user) => user.id !== id)
      })),

      setCategories: (categories) => set({ categories }),
      addCategory: (category) => set((state) => ({
        categories: [category, ...state.categories]
      })),
      updateCategory: (id, update) => set((state) => ({
        categories: state.categories.map((category) =>
          category.id === id ? { ...category, ...update } : category
        )
      })),
      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter((category) => category.id !== id)
      })),

      setMedia: (media) => set({ media }),
      addMedia: (media) => set((state) => ({
        media: [media, ...state.media]
      })),
      deleteMedia: (id) => set((state) => ({
        media: state.media.filter((media) => media.id !== id)
      })),

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
    }),
    {
      name: 'admin-store',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        settings: state.settings,
      }),
    }
  )
);