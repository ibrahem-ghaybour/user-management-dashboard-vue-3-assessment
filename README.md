# User Management Dashboard

A Vue 3 application for managing users with a mock API implementation.

## Features

- User listing with pagination, filtering, and sorting
- User details view
- User creation, editing, and deletion
- Role-based permissions
- Mock API with realistic latency and controllable failure scenarios
- Authentication and session management
- Form validation using Vue's reactivity system
- Custom directives for permissions and focus
- Comprehensive test suite
- Theme switching (light/dark mode)
- Internationalization (i18n) with multiple languages

## Project Structure

```
user-management-dashboard/
│── public/                    # Static assets
│── src/
│   ├── assets/                 # Images, styles, fonts
│   │   ├── users/
│   │   │   ├── UserTable.vue
│   │   │   ├── UserDetail.vue
│   │   │   ├── UserForm.vue
│   │   │   ├── UserActions.vue
│   │   │   ├── RoleSelector.vue
│   │   │   ├── FilterControls.vue
│   │   │   ├── SearchBar.vue
│   │   ├── ui/                 # General UI components (buttons, modals, etc.)
│   │   ├── layouts/            # Layout components
│   │   ├── composables/            # Custom composables (useFetchUsers.ts, usePagination.ts)
│   │   ├── directives/             # Custom Vue directives (v-role, v-focus)
│   │   ├── middleware/             # Authentication & Authorization guards
│   │   ├── pages/                  # Nuxt pages (auto-routed)
│   │   │   ├── index.vue           # Dashboard Home
│   │   │   ├── users/               # Users module
            |   |__new.vue              #create new create
│   │   │   │   ├── index.vue       # Users list
│   │   │   │   ├── [id].vue        # User details/edit page
│   │   ├── plugins/                # Global plugins
│   │   ├── server/api/             # API routes (mock API)
│   │   ├── store/                  # Pinia store
│   │   ├── types/                  # TypeScript interfaces
│   │   ├── utils/                  # Utility functions
│   │   ├── i18n/                   # Localization files
│   │   ├── app.vue                 # Root component
│   │── tests/
│   │   ├── unit/                   # Unit tests
│   │   ├── e2e/                    # End-to-end tests
│   │── .eslintrc.js                # Linting configuration
│   │── nuxt.config.ts              # Nuxt configuration
│   │── tsconfig.json               # TypeScript config
│   │── vitest.config.ts            # Testing config
│   │── package.json                # Dependencies
│   │── README.md                   # Documentation
```

## Mock API Implementation

The application includes a mock API implementation to simulate backend communication. The mock API provides the following features:

- Realistic latency (300-800ms)
- Controllable failure scenarios
- 50+ user records with varied attributes
- Multiple role types with different permissions
- Support for pagination, filtering, and sorting

### API Endpoints

```
GET /api/users - List users (with pagination, filtering)
GET /api/users/{id} - Get specific user
PUT /api/users/{id} - Update user
POST /api/users - Create user
DELETE /api/users/{id} - Delete user
GET /api/roles - Get available roles
POST /api/auth/login - Authenticate user
POST /api/mock-config - Update mock API configuration
POST /api/mock-reset - Reset mock data
```

### Using the Mock API

The mock API is accessed through server API routes. You can interact with it using the provided composables or Pinia stores:

```typescript
// Using composables
import { useFetchUsers } from '~/composables/useFetchUsers';
import { useUser } from '~/composables/useUser';
import { useRoles } from '~/composables/useRoles';

// Using Pinia stores
import { useUsersStore } from '~/store/users';
import { useRolesStore } from '~/store/roles';
import { useAuthStore } from '~/store/auth';

// Example: Fetch users with pagination and filtering
const usersStore = useUsersStore();
await usersStore.fetchUsers();

// Example: Create a new user
await usersStore.createUser({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  role: 'user',
  status: 'active',
  department: 'Engineering',
  location: 'New York'
});

// Example: Check permissions
const rolesStore = useRolesStore();
const canEditUsers = rolesStore.hasPermission('admin', 'users:write');
```

### Testing Error Handling

You can test error handling by simulating API failures using the provided plugin:

```typescript
// In a component or page
const { $mockApi } = useNuxtApp();

// Simulate a failure with 100% probability
$mockApi.simulateFailure(1);

// The failure probability will reset to the default after 5 seconds
```

## Authentication & Authorization

The application includes a complete authentication and authorization system:

- Login page with form validation
- Session timeout handling
- Role-based permissions
- Route guards for protected pages
- Custom directive for permission-based UI rendering

### Using the Role Directive

The `v-role` directive allows you to conditionally render elements based on user permissions:

```html
<!-- Element is shown only if user has the permission -->
<button v-role="'users:write'">Add User</button>

<!-- Element is disabled if user doesn't have the permission -->
<button v-role:disable="'users:delete'">Delete User</button>

<!-- Element is hidden if user doesn't have the permission -->
<button v-role:hide="'users:write'">Edit User</button>

<!-- Element is shown only if user has ALL permissions -->
<button v-role="['users:write', 'users:read']">Manage Users</button>

<!-- Element is shown if user has ANY of the permissions -->
<button v-role.any="['users:write', 'users:read']">View or Edit Users</button>
```

## Form Validation

The application includes a custom form validation system using Vue's reactivity:

```typescript
import { useFormValidation } from '~/composables/useFormValidation';

// Define form values and validation rules
const { 
  values, 
  errors, 
  isValid, 
  validateField, 
  validateForm, 
  resetForm 
} = useFormValidation(
  { name: '', email: '' },
  {
    name: [
      v => !!v || 'Name is required',
      v => v.length >= 3 || 'Name must be at least 3 characters'
    ],
    email: [
      v => !!v || 'Email is required',
      v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Email must be valid'
    ]
  }
);

// Use in a form
const handleSubmit = () => {
  if (validateForm()) {
    // Submit form
  }
};
```

## Internationalization (i18n)

The application supports multiple languages through Vue I18n. Currently, the following languages are available:

- English (en)
- French (fr)
- Spanish (es)

### Using i18n in Components

You can use the built-in translation functions in your components:

```vue
<template>
  <!-- Basic translation -->
  <h1>{{ $t('users.title') }}</h1>
  
  <!-- Translation with parameters -->
  <p>{{ $t('pagination.showing', { from: 1, to: 10, total: 100 }) }}</p>
  
  <!-- Pluralization -->
  <p>{{ $tc('users.selected', selectedCount) }}</p>
  
  <!-- Date formatting -->
  <p>{{ $d(new Date(), 'short') }}</p>
  
  <!-- Number formatting -->
  <p>{{ $n(1000, 'currency') }}</p>
</template>
```

### Using the Localization Composable

For more advanced usage, you can use the `useLocalization` composable:

```typescript
import { useLocalization } from '~/composables/useLocalization';

// In your component setup
const { 
  t, 
  d, 
  n, 
  currentLanguage, 
  languages, 
  changeLanguage,
  formatDate,
  formatNumber
} = useLocalization();

// Change language
const switchToFrench = () => {
  changeLanguage('fr');
};

// Format a date
const formattedDate = formatDate(new Date(), 'long');

// Format a number as currency
const formattedPrice = formatNumber(29.99, 'currency');
```

### Adding New Languages

To add a new language:

1. Create a new JSON file in `src/i18n/locales/` (e.g., `de.json`)
2. Add the language to the available languages in `src/i18n/index.ts`
3. Import and register the new locale in the i18n configuration

### Language Detection

The application automatically detects the user's preferred language based on:

1. Previously selected language (stored in localStorage)
2. Browser language
3. Default language (English)

## Theme Switching

The application supports both light and dark themes. The theme can be toggled using the theme switch in the header.

### Using the Theme Store

```typescript
import { useThemeStore } from '~/store/theme';

// In your component setup
const themeStore = useThemeStore();

// Get current theme
const currentTheme = themeStore.theme; // 'light' or 'dark'

// Toggle theme
themeStore.toggleTheme();

// Set specific theme
themeStore.setTheme('dark');
```

## Architecture Decisions

This section outlines key architectural decisions and approaches used in this application.

### API Call Optimization

To optimize API calls for performance, this application implements several strategies:

1. **Request Batching and Debouncing**: For frequently triggered operations like search and filtering, requests are debounced to prevent excessive API calls. Related data requests are batched together when possible to reduce the number of network requests.

2. **Pagination and Lazy Loading**: Data is loaded in chunks using pagination, with configurable page sizes. This approach reduces initial load time and memory usage, especially for large datasets. Components like user lists implement virtual scrolling for handling large datasets efficiently.

3. **Caching and State Management**: Pinia stores maintain a normalized cache of entities (users, roles) to avoid duplicate requests for the same data. API responses include cache control headers and ETags to leverage browser caching, and the application implements conditional requests with If-None-Match headers to avoid transferring unchanged data.

### Shared Logic Approach

Shared logic in this application is managed through a layered approach:

1. **Composables**: The primary mechanism for sharing logic is through Vue composables. These function-based utilities encapsulate related functionality (e.g., `useLocalization`, `usePagination`, `useFormValidation`) and can be imported wherever needed. This approach leverages Vue's composition API to create reusable, testable logic that maintains reactivity.

2. **Service Layer**: For complex business logic and API interactions, a service layer abstracts implementation details away from components. Services are injected into composables or components, making them easier to mock for testing and allowing for implementation changes without affecting consumers.

3. **Directives and Plugins**: For cross-cutting concerns like permissions (v-role) and internationalization, custom directives and plugins provide a consistent way to apply functionality across the application. This approach keeps components clean and focused on their primary responsibilities.

### Client-Side Data Caching

The client-side data caching strategy for this dashboard includes:

1. **Pinia Store as Primary Cache**: Pinia stores serve as the application's primary cache, maintaining normalized data with relationships between entities. This approach provides a single source of truth while enabling efficient updates and preventing data duplication.

2. **TTL-Based Cache Invalidation**: Each cached entity has a time-to-live (TTL) value that determines when it should be refreshed. Critical data like user permissions has a shorter TTL than relatively static data like role definitions. This balances data freshness with performance.

3. **Optimistic Updates with Rollback**: For better user experience, the UI updates optimistically when users make changes, while the actual API request happens in the background. If the request fails, the application can roll back to the previous state using the cached data, providing immediate feedback while maintaining data integrity.

### Scaling for Hundreds of Permission Types

To scale this application for hundreds of different user permission types:

1. **Permission Grouping and Hierarchies**: Instead of handling individual permissions directly, permissions are organized into logical groups and hierarchies. This approach simplifies permission management and UI rendering decisions. For example, having an "admin:users" permission might automatically grant all user-related sub-permissions.

2. **Bitfield-Based Permission Storage**: For efficient permission checking, permissions are stored using bitfields where each bit represents a specific permission. This allows for fast permission checks using bitwise operations rather than array iterations, significantly improving performance for complex permission scenarios.

3. **Dynamic Permission Discovery**: The application implements a system where UI components can register their required permissions at runtime. This creates a self-documenting permission system that adapts as the application grows, making it easier to manage permission requirements across a large application.

### Testing Strategy

The testing strategy for this application follows a pyramid approach:

1. **Unit Tests**: The foundation consists of extensive unit tests for pure functions, utilities, and composables. These tests verify that individual pieces work correctly in isolation and run quickly to provide immediate feedback during development. The focus is on testing business logic, validation rules, and state transformations.

2. **Component Tests**: The middle layer tests Vue components in isolation using Vue Test Utils. These tests verify that components render correctly with different props and emit the expected events. They also test component interactions like form submissions and user actions without requiring a full browser environment.

3. **Integration and E2E Tests**: The top layer consists of integration tests for critical user flows and end-to-end tests for key features like authentication, user management, and permission-based access. These tests run in a browser-like environment using Cypress to ensure the application works correctly as a whole.

The decision on what to test was based on risk assessment and user impact. Critical paths that affect data integrity or security (like permission checks and form validation) have more comprehensive test coverage, while purely presentational aspects have lighter coverage.

### Offline Capabilities

The approach to offline capabilities in this application includes:

1. **Service Worker for Asset Caching**: A service worker caches static assets and application shell components, allowing the application to load even without an internet connection. This provides a consistent user experience regardless of network conditions.

2. **IndexedDB for Data Persistence**: For offline data access, the application uses IndexedDB to store a subset of server data locally. This includes frequently accessed reference data and user-specific information, allowing users to view and work with their data even when offline.

3. **Background Synchronization**: When users make changes offline, these changes are stored in a queue using IndexedDB. Once connectivity is restored, a background sync process automatically processes this queue and synchronizes changes with the server. Conflict resolution strategies handle cases where server data changed while the user was offline.

This approach balances the need for offline functionality with the complexity of implementation, focusing on providing core features that remain available regardless of network conditions.

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Testing

### Unit Tests

```bash
npm run test
# or
yarn test
```

### Watch Mode

```bash
npm run test:watch
# or
yarn test:watch
```

### Coverage Report

```bash
npm run test:coverage
# or
yarn test:coverage
```

### End-to-End Tests

```bash
npm run test:e2e
# or
yarn test:e2e
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
