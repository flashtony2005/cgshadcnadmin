# System Patterns

## System Architecture

The application employs a **frontend-centric architecture** built with **React** and **TypeScript**. It appears to be a Single Page Application (SPA).

The core architectural pattern is **component-based design**, where UI elements and functionalities are encapsulated within reusable React components.

A **modular feature-based structure** is evident, with distinct features (like "entity-name") residing in their own directories within `src/features/`. This promotes separation of concerns and scalability.

## Key Technical Decisions

*   **Language:** TypeScript is used for static typing, enhancing code quality and maintainability.
*   **UI Library:** React is the primary library for building the user interface.
*   **State Management:**
    *   Local component state is managed using `useState`.
    *   Shared state within a feature module is managed using **React Context API** (e.g., `EntityNameProvider` and `useEntityName` hook). Global state management solutions (like Redux or Zustand) are not explicitly mentioned for the "entity-name" feature but might be used elsewhere in the application.
*   **Forms Management:** **React Hook Form** (`useForm`) is used for managing form state, validation, and submission.
*   **Data Validation:** **Zod** is used for schema definition and data validation, both for forms and potentially for API response validation.
*   **Routing:** A file-based routing system seems tobe in place, suggested by `src/routeTree.gen.ts` and `createFileRoute`. This could be TanStack Router or a similar library.
*   **Styling:** While not explicitly detailed, the use of `className` attributes suggests CSS or a utility-CSS framework (like Tailwind CSS) is being used. The presence of components like `Button`, `Sheet`, `DropdownMenu` from `@/components/ui/` strongly suggests a pre-built UI component library, possibly **Shadcn UI** or a similar system built on top of Radix UI and Tailwind CSS.
*   **Directory Structure:** A conventional structure is followed:
    *   `src/features/[feature-name]/`: Contains all files related to a specific feature.
        *   `components/`: UI components specific to the feature.
        *   `context/`: React Context for state management within the feature.
        *   `data/`: Data schemas (Zod), type definitions, and potentially mock data or data-fetching logic.
        *   `index.tsx`: The main entry point/page component for the feature.
    *   `src/components/`: Shared/common UI components (e.g., layout, UI primitives).
    *   `src/hooks/`: Reusable custom React hooks.
    *   `src/utils/`: Utility functions.
    *   `src/services/`: Likely for API service integrations.
    *   `src/types/`: Global TypeScript type definitions.

## Design Patterns

*   **Provider Pattern:** Used with React Context (e.g., `EntityNameProvider`) to provide state and functions to a subtree of components.
*   **Custom Hooks:** Used to encapsulate and reuse stateful logic (e.g., `useDialogState`, `useEntityName`).
*   **Higher-Order Components (HOCs) / Render Props:** While not explicitly shown in detail, the structure of components like `DataTable` which takes `data` and `columns` props suggests a flexible and configurable component design, which can sometimes involve these patterns.
*   **Modular Design:** Features are developed as independent modules.
*   **Schema-Driven Development:** Zod schemas define the shape of data, driving validation and type generation.
