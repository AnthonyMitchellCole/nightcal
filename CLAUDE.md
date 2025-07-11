# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Available Commands

### Development
- `npm run build` - Build for production 
- `npm run build:dev` - Build with development mode
- `npm run lint` - Run ESLint to check code quality

### Dependencies
- `npm i` - Install dependencies (use this after cloning)

## Architecture Overview

This is a **nutrition tracking Progressive Web App** built with React, TypeScript, and Supabase. The app allows users to log food intake, track nutritional goals, and manage their dietary information.

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Radix UI + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Barcode Scanning**: react-zxing
- **Charts**: Recharts
- **Themes**: next-themes

### Key Architecture Patterns

**Database Schema**: 
- `foods` - Food items with nutritional data per 100g
- `food_logs` - User's daily food intake entries
- `serving_sizes` - Different serving size options for foods
- `meals` - User-configurable meal types (breakfast, lunch, etc.)
- `profiles` - User profiles with nutritional goals and preferences

**Authentication Flow**:
- Protected routes using `ProtectedRoute` component
- Auth context provides user state throughout app
- Supabase handles authentication and session management

**Data Flow**:
- TanStack Query handles all server state with optimistic updates
- Real-time synchronization via `useRealtimeSync` hook
- Supabase client configured with optimized caching (5min stale time, 30min cache)

**Component Structure**:
- `src/pages/` - Route components
- `src/components/` - Organized by feature (food, log, nutrition, settings, etc.)
- `src/hooks/` - Custom hooks for data fetching and business logic
- `src/contexts/` - React contexts for auth and theme
- `src/lib/` - Utility functions and validation schemas

### Key Features
- **Food Management**: Add custom foods, scan barcodes, search USDA database
- **Nutrition Logging**: Log meals with serving sizes, quick-add functionality
- **Progress Tracking**: Visual charts for calories and macros
- **Goal Setting**: Customizable nutritional goals (calories, macros)
- **Meal Management**: User-configurable meal types and timing
- **Offline Support**: PWA with caching for offline usage

### Development Notes
- Uses Supabase Edge Functions for USDA food search integration
- Implements proper TypeScript types generated from Supabase schema
- Real-time updates across tabs/devices via Supabase subscriptions
- Responsive design with mobile-first approach using Tailwind
- Form validation using react-hook-form + zod schemas