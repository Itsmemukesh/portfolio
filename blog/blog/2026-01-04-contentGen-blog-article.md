---
slug: contentGen-blog-article
title: I Built an AI Agent That Writes Documentation — Here's What I Learned
authors: [mukesh]
tags: [ai-agents, vs-code, technical-writing, documentation, mcp, productivity, github-copilot]
date: 2026-01-04
---

There's a quiet crisis in technical documentation that nobody puts on a roadmap, nobody files a ticket for, and nobody celebrates solving. Features ship fast. Designs change at 3pm on a Friday. A Jira ticket gets marked Done while the help article describing it doesn't exist yet — or worse, still describes the old behavior. The documentation team is always playing catch-up, always the last to know, always sprinting to close a gap that opens faster than it can be filled.

I've lived that cycle as a technical writer for years. So I built something to fix it.

<!-- truncate -->

This is the story of **contentGen** — a custom AI agent I built inside VS Code that reads a Jira ticket, studies the Figma design, cross-references Confluence, checks the existing documentation codebase, and then writes a finished, convention-compliant help topic. What used to consume the better part of a working day now takes under 30 minutes. This article is about how it works, what it took to build it, and why I think VS Code agents are one of the most underestimated tools in the industry right now.

## 1. The Problem Nobody Talks About in Tech Docs

Let's paint the picture honestly.

When a new feature ships, a technical writer typically needs to:

- Find and read the Jira ticket (and its child tickets, and its linked tickets)
- Track down the Confluence page where someone wrote a discovery brief three sprints ago
- Open the Figma design file and navigate to the right screens, which may have been reorganized since the last time you looked
- Cross-check whether existing documentation already covers part of this feature
- Understand the naming conventions, the product terminology, the UI labels that are actually shipping
- Figure out which folder in a documentation codebase this content belongs in
- Write a first draft that matches the established writing style, structure, and formatting conventions
- Review it against style guides, snippet libraries, and localization constraints

That's not a writing task. That's a research project that happens to end in writing. And the research phase alone — before a single word of documentation is typed — routinely takes **five to six hours** for a single medium-complexity feature.

Now multiply that across a fast-moving product team with multiple concurrent releases, and you start to understand why documentation debt compounds so quickly.

The bottleneck isn't skill. It's context-gathering. And context-gathering is exactly what AI is good at.

## 2. What Is a VS Code Agent — And Why Most People Underestimate Them

Most people who've used GitHub Copilot think of it as an autocomplete engine that got smarter. A helpful pair programmer. A fast way to generate boilerplate. That's a reasonable impression if you've only used the chat panel.

But VS Code Copilot agents are something different in kind, not just degree.

An agent in VS Code isn't just a chatbot with context about your file. It's a **configurable, tool-wielding, goal-oriented workflow runner**. You define it in a plain Markdown file with a YAML header. You give it a description, a list of tools it's allowed to use, a set of skills it can load, behavioral guardrails, a decision workflow, and a clear understanding of what it's supposed to do — and what it must never do.

When invoked, the agent can:

- Read and write files in your repository
- Execute search queries across your codebase
- Call external APIs and MCP (Model Context Protocol) servers — including Jira, Confluence, Figma, and GitHub
- Ask clarifying questions using structured question cards
- Load modular "skill" definitions to apply specialized domain knowledge
- Hold itself to a strict confirmation gate before making changes

The key insight that most developers and writers miss is this: **VS Code agents aren't assistants that respond to prompts. They are autonomous actors that execute workflows.** The difference matters enormously once you start building with them.

## 3. Meet contentGen: My Documentation Agent

**contentGen** is a custom VS Code agent I designed and built from scratch. The elevator pitch is simple:

> *Give it a Jira ticket number. It reads the design, checks the documentation codebase, and produces a finished, ready-to-review help topic in the correct file, in the correct folder, following the correct conventions.*

But the real value isn't the output — it's what happens between the input and the output. contentGen doesn't generate documentation by guessing. It researches first, synthesizes what it finds, and only writes once it understands the feature as well as a writer who has spent half a day on it.

It sits inside the documentation repository as a single `.agent.md` configuration file. When a writer — or a PM, or an engineer who wants to contribute — invokes it from VS Code, it takes over the research and context-gathering phase entirely, leaving the writer to review and refine rather than discover and draft.

The agent is purpose-built for a MadCap Flare documentation environment, integrated with Atlassian's Jira and Confluence, connected to Figma, and wired into the GitHub repository. It knows the project's folder structure, writing conventions, snippet libraries, template patterns, and localization constraints. It doesn't just write documentation. It writes *this team's* documentation.

## 4. How It Actually Works: The Research-Then-Write Pipeline

The core design principle of contentGen is **research before writing**. The agent will not touch a source file until it has built a complete picture of what it's creating.

Here's the pipeline in plain English:

**Step 1 — Understand the request.** The agent begins by asking the writer a structured set of questions using an interactive question card: Is this a new topic, a revision, or release notes? Which app or product does it belong to? Is there a Jira ticket, a Figma link, or a known file path? It collects only what it needs and recovers missing context through research when possible.

**Step 2 — Jira first.** The agent pulls the ticket, reads the description, acceptance criteria, and linked sub-tasks. It follows links to related engineering tickets or discovery briefs to understand not just *what* the feature does, but *why it exists* and *who it affects*.

**Step 3 — Figma as the source of truth for UI.** The agent opens the linked Figma design and reads it — literally capturing the actual UI labels, button names, field titles, workflow states, and task sequences from the designed interface. This is critical. Documentation that's written from a ticket description and not the design frequently uses wrong labels, wrong names, and wrong sequences. Figma eliminates that.

**Step 4 — Confluence for context.** Any Confluence pages linked to the ticket — discovery briefs, rollout notes, business rules, permissions documentation — are read and synthesized. Edge cases, caveats, and non-obvious behaviors that never make it into a ticket description often live here.

**Step 5 — Repo search for existing coverage.** Before creating anything new, the agent searches the documentation codebase for existing topics, snippets, variables, and templates that relate to the feature. It checks whether the content already exists, whether it needs extending, and whether there are established patterns from similar features it should follow.

**Step 6 — Propose before writing.** The agent presents a high-level summary of its findings: the proposed file path, the sections it plans to create, the template it will use, any variables or snippets it plans to reference. The writer reviews this plan and confirms before a single source file is touched. This gate is non-negotiable — the agent cannot proceed without approval.

**Step 7 — Write with conventions loaded.** Only after confirmation does the agent write the source file. As it does, it loads its specialized skills to apply the correct HTML structure, UI formatting rules, and localization constraints. The output lands in the right `en-us` folder, in the right format, ready for review.

**Step 8 — Validate.** The agent checks its output against repo conventions and obvious structural issues before reporting completion.

The total time for this pipeline, from invocation to a ready-to-review draft: **under 30 minutes.** The equivalent manual process averaged **five to six hours.**

## 5. The Skills Architecture: Modular Intelligence

One of the most important design decisions I made while building contentGen was separating its domain knowledge into modular "skill" files rather than baking everything into the agent definition.

A skill in this system is a standalone Markdown file — a `SKILL.md` — that contains deep, tested, task-specific instructions. The agent loads skills dynamically using the `read_file` tool at the moment they're needed. It doesn't carry all knowledge all the time. It reaches for the right expertise at the right step.

contentGen uses five skills:

- **`determine-content-scope`** — Helps the agent interview the user effectively to understand the task type, delivery scope, and app location without over-asking or under-asking.
- **`interactive-question-ux`** — Governs how the agent asks questions: structured cards, clear options, no unnecessary prompts.
- **`apply-flare-conventions`** — The deep rulebook for MadCap Flare file structure, topic anatomy, TOC integration, and snippet usage.
- **`format-ui-elements`** — Handles correct formatting of buttons, menus, fields, paths, and UI labels in the HTML source.
- **`multilingual-guardrails`** — Ensures the agent only writes in the correct locale folders and never accidentally touches translated content.

This modular approach does something subtle but powerful: it makes the agent **maintainable**. If the style guide changes, you update one skill file. If the localization rules get more complex, you update one skill file. The agent itself stays stable. The knowledge it applies evolves independently.

It also makes the system **extensible**. Want to add support for a new documentation product? Create a new skills file that describes its conventions. The agent picks it up automatically.

## 6. Built-In Guardrails: This Agent Asks Before It Acts

I want to spend a moment on something that I think separates a well-engineered AI agent from an impressive demo: **intentional restraint**.

contentGen has explicit boundaries encoded into its definition. These aren't afterthoughts — they are first-class design requirements.

**It will not invent product behavior.** If Jira, Figma, Confluence, and the existing codebase don't contain enough information to accurately describe a feature, the agent stops and asks. It will not fill gaps with plausible-sounding fabrications, because in documentation, a plausible-sounding wrong answer creates real user confusion.

**It will not write without confirmation.** The proposal-then-confirm gate before writing source files isn't optional. Every invocation requires a human to review the plan and approve it. This keeps the writer in the loop without requiring them to do the research.

**It will not wander out of scope.** The agent changes only the files required by the user's request. If it notices something unrelated that looks inconsistent or outdated in a nearby file, it does not fix it. Scope creep in an automated writing agent produces hard-to-review diffs and unpredictable results.

**It will not touch non-English content.** The multilingual guardrail enforces a hard boundary: contentGen works exclusively in the `en-us` source folders. Translated content is produced through a separate localization pipeline and must never be overwritten by an agent operating on English source.

**It stops and asks when uncertain.** If the correct app folder can't be verified from context, it asks. If a variable name is ambiguous, it asks. If the ticket doesn't have enough detail to determine which existing topic should be revised, it asks. A concise, targeted question is always preferable to a confident wrong answer.

These guardrails are what make the agent trustworthy enough to run on a production documentation codebase. Impressive output from an AI that can't be trusted is a liability, not an asset.

## 7. What It Took to Build It: Design Decisions and Non-Obvious Challenges

Building contentGen from scratch taught me things about AI agents that I didn't find in any tutorial.

**The `.agent.md` format is deceptively powerful.** The file format is simple YAML frontmatter plus Markdown. But the depth of behavioral instruction you can encode in that Markdown — the workflow steps, the decision logic, the tool usage patterns, the explicit boundaries — is substantial. The skill is not in learning the syntax. It's in knowing what to write.

**MCP server integration is where the real power lives.** Connecting the agent to Atlassian's MCP server, Figma's MCP server, and GitHub's MCP server transformed it from a smart file editor into a genuine research agent. These integrations let it reach out to the actual systems of record — not cached summaries, not hallucinated approximations — and pull real, current information. Getting these configured correctly required understanding how MCP servers expose their tools and how to reference them in the agent's tool list.

**Telling the agent where things live is the hardest part.** The most brittle aspect of any documentation agent is the folder-mapping problem: given a feature description, determining which of a dozen possible `en-us` product folders the content belongs in. I solved this partly through the `determine-content-scope` skill, partly through the repo instructions that map product names to folder paths, and partly by instructing the agent to ask when the evidence is ambiguous rather than guess. Getting that triangulation right took more iteration than any other aspect of the build.

**Skills files need to be tested like code.** Early versions of the skills definitions produced inconsistent results because they were too abstract. The skill files that work well are the ones that contain concrete, specific, tested instructions — the same level of precision you'd want in a unit test. Vague guidance produces vague output.

**The confirmation gate changed how I thought about the agent.** Originally, I built the confirmation step as a safety feature. Over time I came to see it differently: it's a communication protocol between the agent and the writer. The proposal summary the agent produces before writing is itself valuable — it forces the agent to articulate its reasoning and gives the writer a fast way to spot misunderstandings before they become wrong files.

## 8. Real-World Impact: Before and After

Let me give you the honest comparison.

**Before contentGen,** the research phase of a documentation task looked like this: open Jira and spend 20-30 minutes reading the ticket and all its linked context. Search for the Confluence page (which might be linked from the ticket, might not be). Open Figma and navigate to the right frame, re-learning the design tooling every time it gets updated. Search the documentation codebase for related topics. Find the right template. Read the style guide to confirm the right formatting for the feature type. All of that before writing the first sentence. **Minimum time: five to six hours for a moderately complex feature.** Sometimes a full day.

**After contentGen,** the writer provides the Jira ticket number and answers a four-question card. The agent reads everything, synthesizes it, and presents a complete content plan in one step. The writer reviews and approves it. The agent writes the draft. **Total elapsed time: under 30 minutes.**

The quality difference matters too. Manually researched documentation is only as good as what the writer happened to find and prioritize. contentGen reads all of it — every linked ticket, every Confluence note, every Figma annotation — and incorporates it. The drafts it produces are more complete on first pass precisely because the research is more thorough than any human would do under deadline pressure.

This isn't about replacing writers. The writer's review and refinement step is still essential, and the agent is built to require it. What's been eliminated is the grinding, low-creativity, high-effort research that precedes real writing — the part that consumes time without producing insight.

## 9. What This Tells Us About the Future of Docs — and AI Agents

I built contentGen to solve a problem I had today. But what it implies about the near future of technical communication is worth sitting with.

The documentation workflow I described in section one — research, synthesize, locate, draft, format, validate — is fundamentally a workflow that requires navigating multiple systems, applying many different rule sets, and producing a structured output in a constrained format. That is exactly the class of problem that well-designed AI agents handle well.

What we're beginning to see is a bifurcation in how AI gets used in knowledge work. On one side, there's AI-assisted work: a writer uses AI to go faster on tasks they're already doing. On the other side, there's AI-delegated work: a writer defines a workflow precisely enough that an agent can execute it end-to-end, and the writer's role becomes oversight, review, and direction.

contentGen lives on the second side of that line. And the gap between the two is not technical capability — it's workflow design. The teams that will lead in AI-assisted documentation aren't the ones with the best prompts. They're the ones who invest in encoding their workflows precisely enough that agents can run them reliably.

VS Code agents — and the MCP protocol that wires them to real data systems — represent a platform that most of the industry hasn't fully absorbed yet. The tools are here. The integration points are here. The gap is in knowing how to design for them.

If you're a technical writer, a docs engineer, or a PM who owns documentation quality and you're not experimenting with agents built on this platform, this is the moment to start.

## 10. What's Next for contentGen

contentGen is working in production, but the backlog of ideas for what it could do next is longer than when I started.

At the top of the list: **release notes automation.** The agent already supports drafting release notes as a task type, but I want to develop a dedicated workflow that can produce a complete, multi-feature release note document from a sprint's worth of Jira tickets in a single invocation.

I'm also exploring **revision detection** — giving the agent the ability to monitor a watched set of Jira tickets and proactively flag when documentation it previously generated may be outdated based on changes to the linked design or ticket status.

Longer term, I want to extend the skills architecture to support **multiple documentation products** more dynamically, allowing a single agent invocation to coordinate changes across related help systems when a shared feature spans multiple products.

There's also the question that every tool builder eventually confronts: **should I share it?** The core agent pattern is generic enough to be useful outside this specific codebase. I'm thinking through what a generalized version of contentGen would look like — one that could be seeded with a team's own style guide, folder conventions, and tool connections.

If you're working on something similar, or thinking about how to bring this kind of workflow automation to your documentation team — I'd genuinely like to compare notes. Find me on [LinkedIn](https://www.linkedin.com/in/mukesh-biswas-tech-writer/).
