# Active Context

## Current Work Focus

The current primary focus is the implementation of a new feature module for managing "entity-name" entities. This involves following the detailed steps outlined in the `步骤.txt` document.

This includes:
1.  Setting up the directory structure for the `entity-name` feature.
2.  Defining the data model (`schema.ts`) using Zod.
3.  Creating the React Context (`entity-name-context.tsx`) for state management within the feature.
4.  Developing the main page component (`index.tsx`).
5.  Building various UI components:
    *   Form drawer (`entity-name-mutate-drawer.tsx`)
    *   Data table components (`columns.tsx`, `data-table.tsx`, `data-table-row-actions.tsx`, `data-table-toolbar.tsx`)
    *   Dialogs (`entity-name-dialogs.tsx`)
    *   Primary action buttons (`entity-name-primary-buttons.tsx`)
6.  Updating routing configurations (`src/routeTree.gen.ts`).
7.  Adding navigation links (`src/components/layout/sidebar-data.tsx`).

The task also involves understanding how these new components and logic integrate with the existing application structure, particularly concerning shared components, UI libraries, and utility functions.

## Recent Changes

*   **Memory Bank Initialization:** The core memory bank files (`projectbrief.md`, `productContext.md`, `systemPatterns.md`, `techContext.md`, `activeContext.md`, `progress.md`) are being created as this is the beginning of the documented work session.
*   **Analysis of `步骤.txt`:** The `步骤.txt` file has been read and analyzed to understand the requirements for the "entity-name" feature.

## Next Steps

1.  **Complete Memory Bank Initialization:** Create the `progress.md` file.
2.  **Begin "entity-name" Feature Implementation:**
    *   Start by creating the directory structure for `src/features/entity-name/` as specified in `步骤.txt`.
    *   Proceed with creating the files and writing the code for each component and module within the `entity-name` feature, following the sequence in `步骤.txt`.
    *   The user's initial request is to "organize and generate templates based on these file steps, with template content sourced from a database." This implies that the code provided in `步骤.txt` should be adapted into Jinja templates. The "database" aspect needs clarification – whether it refers to actual database interaction for template *content* or if the `entity-name` data itself (like fields for the schema) will come from a database to *generate* these templates. For now, the focus will be on creating Jinja templates based on the provided TSX code snippets.

## Active Decisions and Considerations

*   **Templating:** The core task is to convert the provided TSX code snippets from `步骤.txt` into Jinja templates. This means identifying parts of the code that should be dynamic (e.g., "entity-name", field names, etc.) and replacing them with Jinja variables or logic. The existing `templates/` directory structure suggests a pattern for this.
*   **"Database" Sourcing:** The phrase "template content is sourced from the database" needs clarification.
    *   **Option 1:** The *values* to populate the Jinja templates (e.g., the specific entity name like "users", "products") come from a database.
    *   **Option 2:** The *structure* of the entity (fields, types) to generate the Zod schema or form fields comes from a database.
    *   **Option 3:** The `步骤.txt` itself is a generic template, and the "database" provides the specific entity details to customize it.
    Given the existing `codegenF.py`, `db_utils.py`, `entity.py`, it's highly probable that entity definitions (fields, types) are stored in a database, and these are used to generate the code. The Jinja templates will be placeholders for this generated code.
*   **Placeholder for "entity-name":** In the templates, "entity-name" (and its variations like `EntityName`, `entityName`) will be a key variable.

## Important Patterns and Preferences (Inferred/Observed)

*   **Jinja Templating:** The project uses Jinja for code generation, as seen in the `templates/` directory.
*   **Python for Code Generation:** The presence of `.py` files (`codegenF.py`, `config.py`, `db_utils.py`, `entity.py`) indicates Python is used for the code generation process, likely reading entity definitions and rendering Jinja templates.
*   **Modular Feature Structure:** New features are added in `src/features/` with a consistent subdirectory structure.

## Learnings and Project Insights

*   The project has a sophisticated code generation setup.
*   The `步骤.txt` file serves as a blueprint for creating new entity management modules.
*   Understanding the interaction between the Python backend (for codegen) and the Jinja templates is crucial.
