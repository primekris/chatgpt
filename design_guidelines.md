# Design Guidelines: ChatGPT-Style AI Chat Application

## Design Approach
**Reference-Based: ChatGPT UI Pattern**
This application explicitly replicates ChatGPT's proven interface design, optimized for conversational AI interactions with extensive feature sets.

## Layout System

### Core Structure
- **Sidebar Width**: 260px desktop, collapsible to 0px on mobile
- **Main Chat Area**: Flexible width (100% - sidebar width)
- **Max Content Width**: 768px centered for optimal reading
- **Spacing Scale**: Use Tailwind units of 2, 3, 4, 6, 8, 12 for consistent rhythm

### Sidebar Layout
- Fixed left position with smooth slide animation
- Header: Logo + "New Chat" button (h-14)
- Sessions list: Scrollable middle section with hover states
- Footer: Settings, theme toggle, user info (h-16)
- Session items: p-3, rounded-lg, truncated text with 3-dot menu on hover

### Main Chat Layout
- **Header Bar**: h-14, contains model selector, temperature control, sticky top
- **Messages Container**: Scrollable, pb-32 for input clearance
- **Input Area**: Fixed bottom, backdrop-blur, shadow-lg elevation
- **Message Bubbles**: Full-width containers with max-w-3xl centered content

## Typography Hierarchy

### Font System
- **Primary Font**: Inter or System UI (-apple-system, BlinkMacSystemFont)
- **Code Font**: 'Fira Code', 'Consolas', monospace

### Text Sizes
- **Message Text**: text-base (16px) / leading-relaxed
- **UI Labels**: text-sm (14px)
- **Timestamps**: text-xs (12px) / opacity-60
- **Input**: text-base with placeholder:text-sm
- **Code Blocks**: text-sm monospace

## Component Library

### Message Bubbles
- **User Messages**: Right-aligned aesthetic, subtle background differentiation, p-4 spacing
- **AI Messages**: Left-aligned with avatar, p-4 spacing, streaming cursor animation
- **Action Menu**: Absolute positioned 3-dot menu (top-right), reveals on hover
- **Actions**: Copy, Download TXT, Edit, Regenerate, Delete - icon + label on hover

### Input Component
- **Multi-line Textarea**: min-h-12, max-h-64, auto-expanding
- **Submit Button**: Absolute right, rounded-full, icon-only when empty
- **Voice Input**: Microphone icon button (left side)
- **Attachment Button**: Paperclip icon (left side, next to mic)
- **Character Count**: Bottom-right, text-xs, appears when approaching limit

### Code Blocks
- **Container**: rounded-lg, my-4, overflow-hidden
- **Header Bar**: Language label + Copy button + Download button, px-4 py-2
- **Code Area**: p-4, scrollable-x, syntax highlighting via highlight.js
- **Line Numbers**: Optional left gutter, text-xs, opacity-40

### Model Selector Dropdown
- **Active Model**: Displayed with checkmark, full opacity
- **Coming Soon Items**: Grayed out with "Coming Soon" badge, cursor-not-allowed
- **Structure**: Model name + description (text-xs), icon on left

### Temperature Slider
- **Container**: px-4 py-3, labeled "Temperature" with current value
- **Slider Track**: h-2, rounded-full
- **Thumb**: w-4 h-4, rounded-full, shadow-md
- **Labels**: 0.0 (Precise) ← → 1.2 (Creative) at endpoints

### Prompt Templates Panel
- **Grid Layout**: grid-cols-2 gap-3 on desktop, grid-cols-1 on mobile
- **Template Cards**: p-4, rounded-lg, border, hover:shadow-md transition
- **Icon + Title + Description**: Icon size-5, title text-sm font-medium, desc text-xs opacity-70

### System Prompt Editor
- **Modal/Slide-in Panel**: Fixed right, w-96, p-6, shadow-2xl
- **Textarea**: min-h-48, border, rounded-lg, p-3
- **Preset Buttons**: Horizontal scroll, rounded-full pills, px-4 py-2
- **Save/Cancel**: Bottom buttons, full-width on mobile

### Session Management
- **Session Item**: flex justify-between, p-3, rounded-lg, group hover effects
- **Title**: truncate, flex-1, editable on click
- **Timestamp**: text-xs, opacity-60
- **Actions**: Delete icon, appears on hover (group-hover:opacity-100)

### Theme Toggle
- **Switch Component**: w-12 h-6, rounded-full, smooth transition
- **Icons**: Sun/Moon icons, size-4, positioned absolute

### Typing Indicator
- **Container**: flex gap-1, py-2
- **Dots**: 3 circles, w-2 h-2, rounded-full, pulse animation staggered
- **Text**: "AI is thinking..." text-sm opacity-70, ml-2

### Error States
- **Error Message**: p-4, rounded-lg, border-l-4 error accent, bg subtle
- **Retry Button**: mt-3, outlined style, rounded-md
- **Text**: "Something went wrong. Please try again."

## Interaction Patterns

### Animations (Minimal Use)
- **Sidebar Toggle**: transform translate-x, duration-300
- **Message Appearance**: fade-in from opacity-0, duration-200
- **Streaming Text**: Cursor blink animation on last character
- **Button Hovers**: scale-105 or subtle background shift, duration-150

### Responsive Behavior
- **Mobile (<768px)**: Sidebar becomes overlay, full-width messages, bottom nav if needed
- **Tablet (768-1024px)**: Sidebar 240px, maintain core layout
- **Desktop (>1024px)**: Full sidebar 260px, max-width constraints on messages

### Accessibility
- **Focus Indicators**: Visible outline on all interactive elements
- **ARIA Labels**: Buttons, inputs, and dynamic content properly labeled
- **Keyboard Navigation**: Tab order, Enter to send, Escape to close modals
- **Screen Reader**: Announce new messages, status changes

## Critical UX Requirements

### Message Actions Implementation
Each message must have a hoverable 3-dot menu (···) positioned top-right, revealing:
- Copy (icon + text)
- Download TXT (icon + text)
- Edit (user messages only)
- Regenerate (AI messages only)
- Delete (icon + text)

### Export Conversation
Prominent "Export Chat" button in header or session menu, downloads entire conversation as formatted TXT file with timestamps.

### Model Addition Pattern
Clear documentation for adding new models via copy-paste:
1. Add model config object to models array
2. Update model selector dropdown
3. Add API integration following Together AI pattern
4. Document in README

### Session Persistence
LocalStorage-based, no login required. Auto-save on every message. Session list shows most recent first.

This design prioritizes **clarity, efficiency, and familiarity** by following ChatGPT's established patterns while accommodating the extensive feature set. The interface should feel immediately intuitive to anyone who has used ChatGPT.