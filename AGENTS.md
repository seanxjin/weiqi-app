# Instructions for Coding Agents

When developing this application, deliver the smallest correct solution that meets the user's request. Prioritize readable code, clear responsibilities, and predictable behavior over cleverness or speculative flexibility.

## Understand the Task Before Editing

- Read the relevant implementation and its callers before making changes. Follow the project's existing structure and conventions.
- Ask the user when requirements are ambiguous, important behavior is unspecified, or a decision would materially affect the implementation. Do not silently invent requirements.
- Keep changes focused on the task. Preserve unrelated work and existing behavior unless a change is explicitly required.

## Keep the Implementation Simple

- Prefer straightforward control flow and existing utilities over new abstractions or dependencies.
- Do not add configuration, extension points, or features for hypothetical future needs.
- Avoid both oversized implementations and excessive fragmentation. Extract code when it clarifies a distinct responsibility or removes meaningful duplication, not merely to create more files.

## Separate Responsibilities

- Give each function, component, and module a clear purpose.
- Keep presentation, state coordination, game rules, and engine integration in their appropriate layers. Do not duplicate business rules in UI components.
- Keep interfaces between layers explicit so changes in one responsibility do not require unrelated changes elsewhere.

## Use Clear Names

- Name functions after their actions and variables after the values or concepts they represent.
- Prefer domain-specific names over vague names such as `data`, `item`, `manager`, or `handle` when a more precise name is available.
- Follow existing naming conventions and use consistent terminology for the same concept. Avoid unexplained abbreviations.

## Use Async/Await Consistently

- Always use `async`/`await` for asynchronous control flow. Never use Promise `.then()` or `.catch()` methods.
- Handle asynchronous failures with `try`/`catch` where recovery or reporting is needed, and use `finally` when cleanup must always run.
- Preserve error propagation, retries, cancellation, and lifecycle cleanup when changing asynchronous code.
- Keep React effect callbacks synchronous; call an inner async function when asynchronous work is needed.

## Respect These Boundaries

- Do not create tests.
- Do not build the project or run production build commands.
- Do not write documentation or edit README files as part of implementation work. Only change documentation, including this file, when the user explicitly requests that specific change.

## Validate in the Development Environment

- Running the development server and manually checking behavior are encouraged. Use the existing development workflow.
- Check the affected behavior and relevant failure paths without creating tests or building the project.
- Finish with a concise summary of the changes, the checks actually performed, and any unresolved limitations. Never claim that unperformed checks passed.
