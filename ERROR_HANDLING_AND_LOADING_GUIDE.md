# Error Handling and Loading States Guide

This guide covers the comprehensive error handling and loading state system implemented using shadcn/ui components.

## Components Overview

### Error Handling Components

#### 1. ErrorBoundary (`src/components/error-boundary.tsx`)
- **Purpose**: Catches JavaScript errors anywhere in the component tree
- **Features**:
  - Global error boundary for the entire application
  - Custom fallback components
  - Development mode error details
  - Error logging integration
  - Reset functionality

**Usage:**
```tsx
import { ErrorBoundary } from '@/components/error-boundary'

<ErrorBoundary onError={(error, errorInfo) => console.log(error)}>
  <YourComponent />
</ErrorBoundary>
```

#### 2. ErrorHandler (`src/components/error-handler.tsx`)
- **Purpose**: Displays user-friendly error messages with retry functionality
- **Features**:
  - Multiple display variants (inline, dialog, toast)
  - API error type detection
  - Contextual error messages
  - Retry and dismiss actions
  - Specialized error components

**Usage:**
```tsx
import { ErrorHandler, NetworkError, AuthenticationError } from '@/components/error-handler'

// Generic error handling
<ErrorHandler 
  error={error} 
  onRetry={handleRetry}
  onDismiss={() => setError(null)}
/>

// Specialized error components
<NetworkError onRetry={handleRetry} />
<AuthenticationError onLogin={handleLogin} />
```

### Loading State Components

#### 1. LoadingSpinner (`src/components/loading-states.tsx`)
- **Purpose**: Basic loading spinner with customizable size and text
- **Variants**: sm, md, lg

**Usage:**
```tsx
import { LoadingSpinner } from '@/components/loading-states'

<LoadingSpinner size="lg" text="Loading..." />
```

#### 2. Specialized Loading Components

**Page-level Loading:**
```tsx
import { PageLoading, DashboardLoading, ProfileLoading } from '@/components/loading-states'

<PageLoading title="Loading Dashboard" description="Please wait..." />
<DashboardLoading />
<ProfileLoading />
```

**Feature-specific Loading:**
```tsx
import { TriageAnalysisLoading, ClinicSearchLoading, MedicalDataLoading } from '@/components/loading-states'

<TriageAnalysisLoading />
<ClinicSearchLoading />
<MedicalDataLoading />
```

**Inline Loading:**
```tsx
import { ButtonLoading, InlineLoading } from '@/components/loading-states'

<Button disabled={isLoading}>
  {isLoading ? <ButtonLoading text="Saving..." /> : "Save"}
</Button>
```

## Implementation Examples

### 1. Form with Error Handling and Loading

```tsx
"use client"

import { useState } from 'react'
import { ErrorHandler, type ApiError } from '@/components/error-handler'
import { ButtonLoading } from '@/components/loading-states'

export function MyForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError(null)

    try {
      await submitData(data)
    } catch (err) {
      const apiError: ApiError = {
        message: err instanceof Error ? err.message : 'Submission failed',
        status: 500,
        code: 'SUBMIT_ERROR'
      }
      setError(apiError)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <ErrorHandler
          error={error}
          onRetry={() => handleSubmit(lastFormData)}
          onDismiss={() => setError(null)}
        />
      )}
      
      <Button type="submit" disabled={isLoading}>
        {isLoading ? <ButtonLoading text="Submitting..." /> : "Submit"}
      </Button>
    </form>
  )
}
```

### 2. Page with Loading States

```tsx
"use client"

import { useState, useEffect } from 'react'
import { DashboardLoading } from '@/components/loading-states'
import { ErrorHandler } from '@/components/error-handler'

export function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await fetchDashboardData()
      setData(result)
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <DashboardLoading />
  }

  if (error) {
    return (
      <ErrorHandler
        error={error}
        onRetry={loadData}
        variant="dialog"
      />
    )
  }

  return <DashboardContent data={data} />
}
```

## Error Types and Handling

### API Error Interface
```typescript
interface ApiError {
  message: string
  status?: number
  code?: string
  details?: string
}
```

### Common Error Scenarios

1. **Network Errors** (status: 0 or undefined)
   - Connection timeout
   - No internet connection
   - Server unreachable

2. **Authentication Errors** (status: 401)
   - Invalid credentials
   - Session expired
   - Token invalid

3. **Authorization Errors** (status: 403)
   - Insufficient permissions
   - Access denied

4. **Validation Errors** (status: 400)
   - Invalid input data
   - Missing required fields

5. **Server Errors** (status: 500+)
   - Internal server error
   - Service unavailable
   - Database connection issues

## Best Practices

### Error Handling
1. **Always provide user-friendly messages** - Convert technical errors to understandable language
2. **Include retry functionality** - Allow users to retry failed operations
3. **Log errors appropriately** - Send error details to monitoring services
4. **Use appropriate error variants** - Choose between inline, dialog, or toast based on context
5. **Provide context** - Include suggestions for resolving the error

### Loading States
1. **Show immediate feedback** - Display loading states for operations > 200ms
2. **Use contextual loading messages** - "Analyzing symptoms..." vs "Loading..."
3. **Implement skeleton screens** - For content-heavy pages
4. **Disable interactive elements** - Prevent multiple submissions during loading
5. **Show progress when possible** - Use progress indicators for long operations

### Accessibility
1. **Use proper ARIA labels** - Ensure screen readers can understand loading states
2. **Maintain focus management** - Handle focus during error states and loading
3. **Provide alternative text** - For loading spinners and error icons
4. **Use semantic HTML** - Proper roles and landmarks for error messages

## Integration with Global Error Boundary

The application includes a global error boundary in the root layout that:
- Catches unhandled JavaScript errors
- Provides a fallback UI
- Logs errors to monitoring services
- Offers recovery options

This ensures that even unexpected errors don't break the entire application and users always have a way to recover.

## Testing Error Scenarios

To test error handling in development:

1. **Network errors**: Disconnect internet or use browser dev tools to simulate offline
2. **API errors**: Mock API responses with error status codes
3. **JavaScript errors**: Temporarily introduce syntax errors
4. **Timeout errors**: Add artificial delays to API calls

## Monitoring and Analytics

Consider integrating with error monitoring services:
- Sentry for error tracking
- LogRocket for session replay
- Custom analytics for user error patterns

This helps identify common error scenarios and improve the user experience.