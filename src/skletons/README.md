# Skeleton Components

A collection of high-quality loading state skeleton components designed to match your invoice management app's design patterns.

## Overview

These skeleton components provide smooth, animated loading states that maintain the visual structure of your pages while data is being fetched. They're built using your existing design system and UI components for consistency.

## Components

### 1. InvoiceSkeleton
Perfect for the invoices page loading state.

```tsx
import { InvoiceSkeleton } from '@/skletons';

// Basic usage
<InvoiceSkeleton />

// With custom count
<InvoiceSkeleton count={8} />

// Hide filters or total balance
<InvoiceSkeleton showFilters={false} showTotalBalance={false} />
```

**Props:**
- `count?: number` - Number of skeleton rows (default: 5)
- `showFilters?: boolean` - Show filter tabs skeleton (default: true)
- `showTotalBalance?: boolean` - Show total balance skeleton (default: true)

### 2. ExpenseSkeleton
Designed for the expenses page with header, filters, stats, and table.

```tsx
import { ExpenseSkeleton } from '@/skletons';

// Basic usage
<ExpenseSkeleton />

// Custom configuration
<ExpenseSkeleton 
  count={6} 
  showHeader={true} 
  showFilters={true} 
  showStats={true} 
/>
```

**Props:**
- `count?: number` - Number of skeleton rows (default: 5)
- `showHeader?: boolean` - Show header skeleton (default: true)
- `showFilters?: boolean` - Show filters skeleton (default: true)
- `showStats?: boolean` - Show statistics cards (default: true)

### 3. EstimateSkeleton
Similar to InvoiceSkeleton but designed for estimates.

```tsx
import { EstimateSkeleton } from '@/skletons';

<EstimateSkeleton count={7} showTotalValue={true} />
```

**Props:**
- `count?: number` - Number of skeleton rows (default: 5)
- `showFilters?: boolean` - Show filter tabs skeleton (default: true)
- `showTotalValue?: boolean` - Show total value skeleton (default: true)

### 4. ReportSkeleton
Comprehensive skeleton for reports and analytics pages.

```tsx
import { ReportSkeleton } from '@/skletons';

// Full report skeleton
<ReportSkeleton />

// Custom sections
<ReportSkeleton 
  showMetrics={true} 
  showCharts={false} 
  showTable={true} 
/>
```

**Props:**
- `showHeader?: boolean` - Show header skeleton (default: true)
- `showMetrics?: boolean` - Show metrics cards (default: true)
- `showCharts?: boolean` - Show chart placeholders (default: true)
- `showTable?: boolean` - Show data table skeleton (default: true)

### 5. GenericSkeleton
Flexible skeleton component for various use cases.

```tsx
import { GenericSkeleton } from '@/skletons';

// Card layout
<GenericSkeleton type="card" count={6} showHeader />

// List layout
<GenericSkeleton type="list" count={5} showHeader />

// Form layout
<GenericSkeleton type="form" count={4} showHeader showFooter />

// Table layout
<GenericSkeleton type="table" count={6} showHeader showFooter />

// Grid layout
<GenericSkeleton type="grid" count={8} showHeader />
```

**Props:**
- `type?: 'card' | 'list' | 'form' | 'table' | 'grid'` - Layout type (default: 'card')
- `count?: number` - Number of skeleton items (default: 3)
- `className?: string` - Additional CSS classes
- `showHeader?: boolean` - Show header skeleton (default: false)
- `showFooter?: boolean` - Show footer skeleton (default: false)

## Design Principles

### 1. Consistency
- Uses your existing UI components (Card, CardHeader, etc.)
- Matches spacing, typography, and color schemes
- Follows the same responsive breakpoints

### 2. Responsive Design
- Mobile-first approach
- Desktop table views with mobile card fallbacks
- Consistent spacing across screen sizes

### 3. Smooth Animations
- Uses Tailwind's `animate-pulse` for smooth loading animation
- Consistent timing and easing
- Non-intrusive visual feedback

### 4. Accessibility
- Proper semantic structure
- Screen reader friendly
- Maintains focus management

## Usage Examples

### Basic Loading State
```tsx
const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices().then(data => {
      setInvoices(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <InvoiceSkeleton count={8} />;
  }

  return <InvoicesList invoices={invoices} />;
};
```

### Conditional Sections
```tsx
const ExpensePage = () => {
  const [loading, setLoading] = useState(true);
  const [showStats, setShowStats] = useState(true);

  if (loading) {
    return (
      <ExpenseSkeleton 
        count={6} 
        showStats={showStats}
        showFilters={true}
      />
    );
  }

  return <ExpenseList />;
};
```

### Custom Generic Skeleton
```tsx
const CustomPage = () => {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <GenericSkeleton 
        type="card" 
        count={4} 
        showHeader 
        className="max-w-4xl mx-auto"
      />
    );
  }

  return <CustomContent />;
};
```

## Best Practices

1. **Match Content Structure**: Use skeletons that closely match your actual content layout
2. **Appropriate Count**: Set realistic item counts that match expected data
3. **Conditional Rendering**: Show/hide skeleton sections based on user preferences
4. **Performance**: Keep skeleton components lightweight and efficient
5. **User Feedback**: Combine with loading spinners for better UX

## Customization

All skeleton components use your design system's:
- Color tokens (`bg-muted`, `text-muted-foreground`)
- Spacing scale (`p-4`, `space-y-4`, etc.)
- Border radius (`rounded`, `rounded-lg`)
- Typography classes
- Responsive utilities

To customize, you can:
1. Override classes using the `className` prop
2. Modify the base components in the skeleton files
3. Create new skeleton variants by extending existing components

## Demo

Check out `SkeletonDemo.tsx` for interactive examples of all skeleton components and their configurations.

