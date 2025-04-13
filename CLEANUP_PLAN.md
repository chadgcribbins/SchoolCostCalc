# Codebase Cleanup Plan

This document outlines the steps to clean up and standardize the project structure.

## Issues Identified

1. **Duplicate Files:**

   - Outdated JavaScript files in `src/` root directory
   - Duplicate TypeScript components in both `src/components/` and `src/components/calculator/`

2. **Inconsistent Import Paths:**

   - Some files import from `@/components/`
   - Others import from `@/components/calculator/`

3. **Environment Variable Security:**
   - Need proper setup for environment variables with template examples and secure local values

## Cleanup Steps

### 1. Environment Variables

- [x] Copy `.env` to `.env.local` (not tracked by git)
- [x] Ensure `.env` contains only placeholder values
- [x] Confirm `.env` is excluded from git tracking via .gitignore
- [x] Verify `.env.example` exists as a template for other developers

### 2. Remove Outdated JavaScript Files

Run the provided script to move outdated JS files to the archive:

```bash
./cleanup-script.sh
```

This will move the following files to `archive/backup/`:

- [x] `src/App.js`
- [x] `src/CostCustomizationPanel.js`
- [x] `src/CostSummary.js`
- [x] `src/FamilyMembersPanel.js`
- [x] `src/index.js`
- [x] `src/MainCalculator.js`
- [x] `src/real-schools-data.js`
- [x] `src/VisualizationPanel.js`
- [x] `src/YearlyProjection.js`

### 3. Standardize Component Imports

Run the provided script to update import paths:

```bash
./update-imports.sh
```

This will update all imports to use the standardized path `@/components/` instead of `@/components/calculator/`.

### 4. Remove Duplicate Components

Run the provided script to remove duplicate components from the calculator directory:

```bash
./remove-duplicates.sh
```

This will move the following files to `archive/calculator-backup/`:

- [x] `src/components/calculator/MainCalculator.tsx`
- [x] `src/components/calculator/CostCustomizationPanel.tsx`
- [x] `src/components/calculator/CostSummary.tsx`
- [x] `src/components/calculator/FamilyMembersPanel.tsx`
- [x] `src/components/calculator/VisualizationPanel.tsx`
- [x] `src/components/calculator/YearlyProjection.tsx`

### 5. Further Improvements (Manual Steps)

1. **Organize Components by Feature:**

   - Consider organizing components into feature-based folders
   - For example: `src/components/family/`, `src/components/costs/`, etc.

2. **Next.js App Router Best Practices:**

   - Follow Next.js App Router conventions for page components
   - Use server components where possible to improve performance
   - Minimize use of 'use client' directives

3. **TypeScript Consistency:**
   - Ensure all components have proper TypeScript interfaces
   - Standardize on using interfaces over types
   - Add proper return types to all functions

## After Cleanup

After cleanup, the project should have:

1. Clearly organized directory structure
2. No duplicate components
3. Consistent import paths
4. Secure environment variable handling
5. Better TypeScript usage throughout the codebase
