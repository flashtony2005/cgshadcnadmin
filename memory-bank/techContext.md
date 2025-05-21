# Technical Context

## Technologies Used

*   **Core:**
    *   **React:** JavaScript library for building user interfaces.
    *   **TypeScript:** Superset of JavaScript that adds static typing.
*   **State Management:**
    *   React `useState` hook for local component state.
    *   React Context API for shared state within feature modules.
*   **Forms:**
    *   **React Hook Form:** For efficient form handling and validation.
    *   **Zod:** For schema definition and data validation, used with React Hook Form via `@hookform/resolvers/zod`.
*   **Routing:**
    *   Likely **TanStack Router** or a similar file-based routing solution (inferred from `createFileRoute` and `src/routeTree.gen.ts`).
*   **UI Components & Styling:**
    *   Custom components built with React and TypeScript.
    *   A UI component library like **Shadcn UI** is strongly indicated by the path `@/components/ui/` and component names (`Button`, `Sheet`, `DropdownMenu`, `Input`, `Form`, etc.). This typically implies the use of:
        *   **Tailwind CSS:** For utility-first styling.
        *   **Radix UI:** For unstyled, accessible UI primitives that Shadcn UI builds upon.
    *   Icons from `@radix-ui/react-icons` and `@tabler/icons-react`.
*   **Package Management:**
    *   **pnpm:** Used for managing project dependencies (inferred from `pnpm lint`, `pnpm format`, `pnpm build` commands in `步骤.txt`).
*   **Linting & Formatting:**
    *   ESLint (implied by `pnpm lint`).
    *   Prettier or a similar formatter (implied by `pnpm format`).
*   **Build Tool:**
    *   Vite or a similar modern build tool is likely used for React/TypeScript projects, though not explicitly stated. `pnpm build` would invoke this.
*   **Version Control:**
    *   **Git:** For source code management.

## Development Setup

*   A Node.js environment is required to run `pnpm` and the development server.
*   Code editor (e.g., VSCode) with appropriate extensions for TypeScript, React, ESLint, Prettier.
*   The project is structured with a `src` directory containing the main application code.
*   Generated files (like `src/routeTree.gen.ts`) suggest a code generation step as part of the development or build process, likely related to routing.

## Technical Constraints & Considerations

*   **TypeScript Strictness:** The level of TypeScript strictness (e.g., `strictNullChecks`) is not specified but is a factor in development.
*   **Browser Compatibility:** Target browsers are not specified but should be considered for a web application.
*   **API Dependencies:** The frontend will depend on backend APIs for data. The structure of these APIs and their contracts will influence frontend development. The `步骤.txt` uses mock data (`entityNames` from `./data/entity-name`), indicating that actual API integration might be a separate step or handled by other modules.
*   **Performance:** As a SPA, attention should be paid to bundle size, code splitting, and rendering performance.
*   **Testing:** `步骤.txt` mentions build and linting but not specific testing commands (e.g., unit tests, integration tests). A testing strategy (e.g., Jest, React Testing Library) would typically be part of a robust project.

## Tool Usage Patterns

*   **CLI Commands:**
    *   `pnpm lint`: To check for code quality and style issues.
    *   `pnpm format`: To automatically format code.
    *   `pnpm build`: To create a production build of the application.
    *   `git add .`, `git commit -m "..."`, `git push ...`: Standard Git commands for version control.
*   **Component Imports:** Aliased paths like `@/components/` are used for cleaner imports, configured likely in `tsconfig.json` and the build tool.
