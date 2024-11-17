import { Component } from 'vue'

export interface Tool {
  id: string
  name: string
  description: string
  path: string
  category: string
  gradientColor: string
  tags: string[]
  icon: Component
}

export type ToolCategory = {
  id: string
  name: string
}

export type FileStatus = 'waiting' | 'processing' | 'done' | 'error'

export interface ProcessedFile {
  id: string
  file: File
  preview: string
  status: FileStatus
  compressed?: File
  error?: string
} 