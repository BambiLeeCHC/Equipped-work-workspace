/* ═══════════════════════════════════════════════════════════════════
   E-Quipped: Work — Full AI Business Mastery Curriculum
   7 modules · 35 lessons · sandbox + quiz per lesson
   ═══════════════════════════════════════════════════════════════════ */

export type Tier = "free" | "pro" | "business" | "elite" | "master";

export interface SandboxCriterion {
  name: string;
  description: string;
  keywords: string[];
  weight: number;
}

export interface SandboxActivity {
  task: string;
  context: string;
  examplePrompt?: string;
  criteria: SandboxCriterion[];
  minLength: number;
  passingScore: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  questions: QuizQuestion[];
  passingPercent: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  order: number;
  xpReward: number;
  content: string;
  sandbox: SandboxActivity;
  quiz: Quiz;
}

export interface Module {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tier: Tier;
  order: number;
  icon: string;
  lessons: Lesson[];
}

const P_QUIZ = 80;
const P_SAND = 70;

/* ═══════════════════════════════════════════════
   HELPER: Build a quiz quickly
   ═══════════════════════════════════════════════ */
function q(question: string, options: string[], correctIndex: number, explanation: string): QuizQuestion {
  return { question, options, correctIndex, explanation };
}

/* ═══════════════════════════════════════════════
   MODULE 1 — AI Prompting Fundamentals (FREE)
   ═══════════════════════════════════════════════ */
const M1: Lesson[] = [
  /* ── L1 — What Is AI & The C.R.A.F.T. Prompt Method ── */
  {
    id: "m1-l1", moduleId: "mod-1", title: "What Is AI & The C.R.A.F.T. Prompt Method", order: 1, xpReward: 50,
    content: `## What Is AI & The C.R.A.F.T. Prompt Method

### How AI Actually Works

Modern AI — particularly **large language models (LLMs)** like GPT-4o, Claude, and Gemini — works by predicting the most likely next word (token) in a sequence. It doesn't "think" or "know" — it generates plausible-sounding text based on patterns learned from training data.

### Three Rules of AI

1. **AI doesn't know facts** — it predicts likely text. It can confidently produce wrong answers ("hallucinations"). Always verify.
2. **Context is everything** — the more specific your input, the better the output.
3. **AI is a force multiplier** — it excels at drafting, summarizing, brainstorming, and reformatting. It amplifies your expertise.

### The C.R.A.F.T. Method ™

The quality of your AI output is directly proportional to the quality of your **prompt** — the instruction you give to AI. We use the **C.R.A.F.T.** acronym to build effective prompts every time:

| Letter | Stands For | What It Means | Example |
|---|---|---|---|
| C | Context | Background & situation | "I run a 5-person marketing agency…" |
| R | Role | Who AI should be | "Act as an experienced brand strategist…" |
| A | Action | The specific task | "Write a 3-paragraph client pitch…" |
| F | Format | How output should look | "Use bullet points, under 200 words…" |
| T | Tone & guardrails | Style + boundaries | "Professional but warm. Avoid jargon." |

### C.R.A.F.T. in Action

❌ **Without C.R.A.F.T.:** "Write me a business email."

✅ **With C.R.A.F.T.:** "**[C]** I run a small SaaS company. A client hasn't logged in for 30 days. **[R]** Act as a customer success manager. **[A]** Write a re-engagement email with 3 value propositions. **[F]** Under 150 words, use bullet points for the value props. **[T]** Professional but warm — no pushy sales language."

Notice the difference? The first prompt could produce anything. The C.R.A.F.T. prompt produces exactly what you need.

### What Happens When You Skip a Letter

| Missing Element | What Goes Wrong |
|---|---|
| No Context | AI makes wrong assumptions about your situation |
| No Role | Generic, unfocused output with no expertise |
| No Action | Vague, off-target response |
| No Format | Unusable wall of text |
| No Tone | Wrong voice, may include things you don't want |

> **Key takeaway:** Every great AI interaction starts with a well-crafted prompt. Memorize C.R.A.F.T. — you'll use it in every lesson from here on.`,
    sandbox: {
      task: "Using the C.R.A.F.T. method, write a prompt that includes all 5 elements (Context, Role, Action, Format, Tone). Your task: ask AI to create a welcome email for new customers of a small online boutique.",
      context: "You just learned C.R.A.F.T. — now apply each letter. Label each element so the grader can see your structure (e.g., '[C] I run…', '[R] Act as…', etc.).",
      examplePrompt: "[C] I own a small online boutique selling handmade candles. [R] Act as an email marketing specialist. [A] Write a welcome email for new customers who just made their first purchase. [F] 3 short paragraphs, include a 10% discount code placeholder. [T] Friendly, warm, and grateful — no corporate-speak.",
      criteria: [
        { name: "Context provided", description: "Background/situation given", keywords: ["boutique", "online", "shop", "store", "business", "sell", "customer", "product", "[C]", "context"], weight: 20 },
        { name: "Role assigned", description: "Tells AI who to be", keywords: ["act as", "you are", "role", "specialist", "expert", "writer", "marketer", "[R]"], weight: 20 },
        { name: "Action specified", description: "Clear task", keywords: ["write", "create", "draft", "welcome", "email", "[A]", "action"], weight: 20 },
        { name: "Format defined", description: "Output structure", keywords: ["paragraph", "word", "bullet", "short", "format", "section", "include", "[F]"], weight: 20 },
        { name: "Tone set", description: "Style + guardrails", keywords: ["tone", "friendly", "warm", "professional", "avoid", "don't", "no", "[T]"], weight: 20 },
      ],
      minLength: 80, passingScore: P_SAND,
    },
    quiz: {
      passingPercent: P_QUIZ,
      questions: [
        q("What does C.R.A.F.T. stand for?", ["Create, Review, Adjust, Finalize, Test", "Context, Role, Action, Format, Tone & guardrails", "Clarity, Relevance, Accuracy, Fluency, Truthfulness", "Concept, Research, Apply, Feedback, Tweak"], 1, "C.R.A.F.T. = Context, Role, Action, Format, Tone & guardrails."),
        q("How do large language models (LLMs) generate text?", ["By searching the internet in real-time", "By predicting the most likely next token in a sequence", "By retrieving pre-written answers from a database", "By understanding the true meaning of words"], 1, "LLMs predict the most probable next token given the input sequence."),
        q("What is an AI 'hallucination'?", ["When AI produces creative content", "When AI confidently generates incorrect information", "When AI refuses to answer", "When AI processes images"], 1, "Hallucination is when AI confidently presents false information as fact."),
        q("What happens when you skip the 'Format' element in C.R.A.F.T.?", ["AI asks for clarification", "You get a wall of unstructured text", "The prompt still works fine", "AI auto-detects the right format"], 1, "Without format instructions, AI produces long, unstructured paragraphs."),
        q("Which prompt follows C.R.A.F.T. correctly?", ["Write a business plan", "Help me with marketing", "I run a bakery [C]. Act as a menu consultant [R]. Create 5 seasonal specials [A]. Table format with price ranges [F]. Fun, approachable tone [T].", "Make it professional and good"], 2, "Only this option includes all 5 C.R.A.F.T. elements."),
      ],
    },
  },

  /* ── L2 — Context & Role Mastery ── */
  {
    id: "m1-l2", moduleId: "mod-1", title: "Context & Role Mastery", order: 2, xpReward: 50,
    content: `## Context & Role Mastery

In Lesson 1 you learned C.R.A.F.T. — now let's go deep on the two most powerful letters: **C** (Context) and **R** (Role). These two elements alone account for 70%+ of output quality.

### The 5-Layer Context Stack

Great context isn't just one sentence — it's layered. Stack these five layers for maximum precision:

| Layer | What to Include | Example |
|---|---|---|
| 1. Industry | Your sector / niche | "We're in boutique fitness…" |
| 2. Company | Size, stage, details | "…a 2-location yoga studio with 8 instructors…" |
| 3. Situation | What's happening now | "…launching a corporate wellness program…" |
| 4. Task | The specific deliverable | "…need a partnership pitch deck…" |
| 5. Audience | Who will see the output | "…for HR directors at mid-size companies." |

### Role Levels: From Amateur to Expert

Not all roles are equal. Compare these three levels:

**Level 1 (Basic):** "Act as a marketing consultant."
**Level 2 (Specific):** "Act as a B2B marketing consultant with 10 years of experience in health & wellness."
**Level 3 (Expert):** "Act as a B2B marketing consultant specializing in corporate wellness partnerships for boutique fitness brands. You've closed 40+ B2B deals. You favor ROI-driven pitches and are skeptical of tactics that can't show measurable results within 90 days."

Level 3 gives AI a **worldview** — experience, specialization, and decision-making philosophy. This produces dramatically better output.

### The Persona + Scenario Pattern

Combine a detailed role with a specific scenario for the most grounded results:

"You are **[detailed persona]**. A **[specific scenario]** has occurred. Based on your expertise, **[specific task]**."

### Upgrading a Weak Prompt

Here's a real before/after using what you've learned:

❌ **Before:** "Write a social media strategy."

✅ **After:** "**[C]** I own a 2-location yoga studio with 8 instructors. We're launching a corporate wellness program targeting mid-size companies in Austin. Our budget is $500/month for social media. **[R]** Act as a social media strategist who specializes in local B2B marketing for wellness brands. You favor organic reach strategies over paid ads for businesses under $1M revenue. **[A]** Create a 30-day LinkedIn content calendar. **[F]** Table format: Day | Post Type | Topic | CTA. **[T]** Professional but approachable. Avoid generic wellness clichés."

> **Key takeaway:** The Context stack + Level 3 Role are what separate a "meh" AI output from one that feels like it came from a $200/hour consultant.`,
    sandbox: {
      task: "Take this weak prompt and rewrite it using a Level 3 Role and full 5-Layer Context Stack (Industry, Company, Situation, Task, Audience). Weak prompt: 'Write me a business proposal.'",
      context: "Apply the context layering and role levels you just learned. Pick any small business scenario you like.",
      examplePrompt: "[C - Industry] I'm in the pet care industry. [C - Company] I run a mobile dog grooming service with 2 vans and 3 groomers in Denver. [C - Situation] I want to pitch a monthly grooming package to a local doggy daycare chain. [C - Task] Write a one-page partnership proposal. [C - Audience] The reader is the daycare chain's operations manager. [R - Level 3] Act as a B2B sales consultant specializing in local service partnerships. You've helped 30+ small service businesses land recurring B2B contracts. You favor clear ROI projections over flashy language. [A] Draft the proposal. [F] One page, 3 sections: Value Prop, Package Details, ROI Projection. [T] Confident and professional. No fluff.",
      criteria: [
        { name: "Level 3 role", description: "Role with experience, specialization, and philosophy", keywords: ["years", "experience", "specializ", "expert", "approach", "philosophy", "helped", "favor", "skeptical"], weight: 25 },
        { name: "Industry + Company layers", description: "Names industry and company details", keywords: ["industry", "company", "team", "employee", "business", "location", "revenue", "size", "run", "own"], weight: 20 },
        { name: "Situation + Task layers", description: "Current situation and deliverable", keywords: ["currently", "launching", "preparing", "facing", "need", "want", "proposal", "write", "create", "plan"], weight: 20 },
        { name: "Audience layer", description: "Identifies who receives output", keywords: ["audience", "reader", "stakeholder", "client", "manager", "director", "team", "will read", "presented to"], weight: 15 },
        { name: "Format + Tone", description: "Includes format and tone", keywords: ["format", "page", "bullet", "section", "tone", "professional", "avoid", "word", "paragraph"], weight: 10 },
      ],
      minLength: 120, passingScore: P_SAND,
    },
    quiz: {
      passingPercent: P_QUIZ,
      questions: [
        q("What are the 5 layers of the Context Stack?", ["Role, Task, Format, Tone, Constraints", "Industry, Company, Situation, Task, Audience", "Who, What, When, Where, Why", "Background, Problem, Solution, Timeline, Budget"], 1, "Industry → Company → Situation → Task → Audience."),
        q("What makes a Level 3 Role different from Level 1?", ["It's just longer", "It includes experience, specialization, and decision-making philosophy", "It uses more formal language", "It always mentions a job title"], 1, "Level 3 adds specificity: track record, specialization, and worldview."),
        q("Which context layer answers 'Who will read this?'", ["Industry", "Company", "Situation", "Audience"], 3, "The Audience layer specifies who receives the output."),
        q("What is a 'context dump'?", ["Clearing AI memory", "A long initial message giving all background for complex projects", "A debugging technique", "A method to shorten prompts"], 1, "A detailed initial message that AI maintains as context for follow-ups."),
        q("Why does 'Persona + Scenario' produce better results than a role alone?", ["More words = better output", "It gives AI both identity AND a realistic situation to ground its response", "It's faster to write", "It only works with certain AI tools"], 1, "Combining persona + scenario grounds responses in a specific, realistic context."),
      ],
    },
  },

  /* ── L3 — Advanced Frameworks: RACE & Chain-of-Thought ── */
  {
    id: "m1-l3", moduleId: "mod-1", title: "Advanced Frameworks: RACE & Chain-of-Thought", order: 3, xpReward: 50,
    content: `## Advanced Frameworks: RACE & Chain-of-Thought

You now know C.R.A.F.T. for structuring any prompt. In this lesson, you'll learn two additional frameworks that build on those fundamentals for specific situations.

### RACE — For Quick, Focused Tasks

When you need something fast (an email, a summary, a short piece of content), RACE streamlines C.R.A.F.T. into four steps:

- **R** — Role: Who AI should be
- **A** — Action: The specific task
- **C** — Context: Background info
- **E** — Execute: Output specs (format + constraints)

**RACE Example:** "**[R]** Act as an HR manager. **[A]** Write a rejection email for a candidate. **[C]** The candidate interviewed for a junior marketing role and was strong but we chose someone with more analytics experience. **[E]** Under 100 words, empathetic tone, invite them to apply for future roles."

### Chain-of-Thought (CoT) — For Complex Analysis

For multi-step problems, ask AI to **think step by step**. This dramatically improves accuracy for reasoning tasks.

❌ **Without CoT:** "Should we open a second location?"

✅ **With CoT:** "**[R]** Act as a small business expansion consultant. **[C]** I own a profitable coffee shop doing $40K/month revenue, 85% capacity on weekends. Considering a second location 3 miles away. **[A]** Analyze whether I should expand. Think step by step: (1) What data do I need to decide? (2) What are the top 3 risks? (3) What are the top 3 opportunities? (4) What's your recommendation with reasoning? **[F]** Numbered sections matching each step."

### When to Use Which

| Situation | Best Framework | Why |
|---|---|---|
| Quick email or message | RACE | Fast, focused, 4 steps |
| Any structured task | C.R.A.F.T. | Comprehensive, covers everything |
| Complex decisions or analysis | C.R.A.F.T. + CoT | Step-by-step reasoning produces deeper output |
| Multi-part projects | RACE setup + CoT steps | Combine speed with depth |

### Combining Frameworks

Power users layer frameworks: use C.R.A.F.T. or RACE to set up the prompt, then add "think step by step" for the reasoning portion. This gives you structure AND depth.

> **Key takeaway:** C.R.A.F.T. is your everyday workhorse. Add RACE for speed, CoT for depth. You can always layer them.`,
    sandbox: {
      task: "Write TWO prompts for the same scenario (a small bakery deciding whether to add online ordering): (1) A RACE prompt for a quick pros/cons list, and (2) A C.R.A.F.T. + Chain-of-Thought prompt for a deep analysis. Label each clearly.",
      context: "You own a popular neighborhood bakery with 3 employees. You're considering adding online ordering and delivery. Show you can pick the right framework for the right depth.",
      criteria: [
        { name: "RACE prompt present", description: "Uses RACE structure", keywords: ["race", "[R]", "[A]", "[C]", "[E]", "role", "action", "context", "execute"], weight: 20 },
        { name: "CoT prompt present", description: "Uses step-by-step reasoning", keywords: ["step by step", "step 1", "step 2", "first", "then", "analyze", "think through", "chain"], weight: 25 },
        { name: "Both prompts labeled", description: "Clearly distinguishes the two", keywords: ["prompt 1", "prompt 2", "race", "craft", "quick", "deep", "cot", "chain of thought"], weight: 15 },
        { name: "Bakery context", description: "Uses the scenario details", keywords: ["bakery", "online", "delivery", "ordering", "employee", "small", "neighborhood"], weight: 15 },
        { name: "Different depths", description: "Shows quick vs. deep approaches", keywords: ["pros", "cons", "list", "risk", "opportunity", "cost", "revenue", "factor", "recommendation"], weight: 15 },
      ],
      minLength: 150, passingScore: P_SAND,
    },
    quiz: {
      passingPercent: P_QUIZ,
      questions: [
        q("What does RACE stand for?", ["Role, Action, Context, Execute", "Research, Analyze, Create, Edit", "Role, Audience, Content, Expression", "Result, Action, Context, Example"], 0, "RACE = Role, Action, Context, Execute."),
        q("When is Chain-of-Thought most useful?", ["Simple one-line tasks", "Complex reasoning and multi-step analysis", "Only creative writing", "Formatting text"], 1, "CoT is most powerful for complex reasoning where step-by-step analysis matters."),
        q("What phrase activates Chain-of-Thought reasoning?", ["Please hurry", "Think step by step", "Be creative", "Use your best judgment"], 1, "'Think step by step' prompts AI to show sequential reasoning."),
        q("How does RACE relate to C.R.A.F.T.?", ["They're completely different", "RACE is a streamlined version for quick tasks — it combines Format and Tone into 'Execute'", "RACE replaces C.R.A.F.T.", "C.R.A.F.T. is outdated"], 1, "RACE streamlines C.R.A.F.T. for speed; 'Execute' covers format + constraints."),
        q("How can frameworks be combined?", ["You can't combine them", "Use C.R.A.F.T. or RACE for setup, then add CoT for complex reasoning", "Always use all at once", "Combining frameworks confuses AI"], 1, "Layer frameworks: C.R.A.F.T./RACE for structure, CoT for reasoning depth."),
      ],
    },
  },

  /* ── L4 — Iterating & Refining: The Feedback Loop ── */
  {
    id: "m1-l4", moduleId: "mod-1", title: "Iterating & Refining: The Feedback Loop", order: 4, xpReward: 50,
    content: `## Iterating & Refining: The Feedback Loop

You now know how to write a great first prompt with C.R.A.F.T. But the best AI users know that **great output is rarely one-shot**. This lesson teaches you how to systematically improve AI responses.

### The 3-Pass Method

| Pass | What You Do | Example Follow-Up |
|---|---|---|
| 1. Generate | Send your C.R.A.F.T. prompt, get initial output | (Your original prompt) |
| 2. Critique | Ask AI to evaluate its own work | "Review what you wrote. What are the 3 weakest parts?" |
| 3. Refine | Give specific instructions to improve | "Rewrite section 2, making it more specific with real numbers." |

### Powerful Iteration Commands

These build on each other — use them in sequence:

- **"Make it more specific"** — Replaces vague language with concrete details
- **"Cut this by 50%"** — Forces AI to keep only the highest-value content
- **"Rewrite for [different audience]"** — Adapts content without starting over
- **"What's missing?"** — AI identifies gaps in its own response
- **"Give me 3 alternative versions"** — Generates options to compare
- **"Challenge your own reasoning"** — Forces devil's advocate analysis

### Refine, Don't Restart

Each message in a conversation builds on context. Refining is almost always better than restarting because:

- AI retains all conversation context from earlier messages
- Each refinement narrows the solution space
- You can reference specific parts ("Rewrite paragraph 3…")

### When to Restart vs. Refine

| Restart When… | Refine When… |
|---|---|
| The entire direction is wrong | Structure is right, details need work |
| 15+ confused messages in the thread | Tone or format needs adjustment |
| Significantly new context changes everything | Need to expand or trim sections |

### Meta-Prompting: Let AI Improve Your Prompt

Before executing a task, try: "Before you execute this, suggest 3 ways I could improve this prompt to get a better result."

This uses AI to audit YOUR prompting technique — it often catches missing C.R.A.F.T. elements.

> **Key takeaway:** First draft → Critique → Refine. The 3-Pass Method turns good AI output into great output. Never settle for the first response.`,
    sandbox: {
      task: "Demonstrate the 3-Pass Method: (1) Write a C.R.A.F.T. prompt for any small business task, (2) Write the critique follow-up you'd send, (3) Write the refinement follow-up. Label each pass clearly.",
      context: "Show mastery of iteration by writing all three messages you'd send in sequence. Pick any scenario — the key is showing Generate → Critique → Refine.",
      examplePrompt: "PASS 1 (Generate): [C] I run a dog walking service in Seattle with 5 walkers. [R] Act as a small business marketing consultant. [A] Write 5 Instagram post ideas for the month. [F] Table: Post # | Visual Idea | Caption Hook | CTA. [T] Fun, casual, dog-lover voice.\n\nPASS 2 (Critique): Review the 5 post ideas you created. Which two are weakest and why? What's missing that would make this more engaging for local dog owners?\n\nPASS 3 (Refine): Rewrite the two weakest posts based on your critique. Also add a 6th post that includes a seasonal tie-in for summer.",
      criteria: [
        { name: "Pass 1 - Generate", description: "Has a C.R.A.F.T. initial prompt", keywords: ["pass 1", "generate", "act as", "write", "create", "[C]", "[R]", "[A]", "context", "role"], weight: 25 },
        { name: "Pass 2 - Critique", description: "Asks AI to evaluate its work", keywords: ["pass 2", "critique", "review", "evaluate", "weak", "missing", "improve", "what's wrong", "assess"], weight: 30 },
        { name: "Pass 3 - Refine", description: "Specific refinement instructions", keywords: ["pass 3", "refine", "rewrite", "revise", "improve", "update", "change", "adjust", "based on"], weight: 30 },
        { name: "Clear labeling", description: "Passes are labeled and sequential", keywords: ["pass 1", "pass 2", "pass 3", "step 1", "step 2", "step 3", "first", "then", "finally"], weight: 15 },
      ],
      minLength: 120, passingScore: P_SAND,
    },
    quiz: {
      passingPercent: P_QUIZ,
      questions: [
        q("What are the 3 passes in the 3-Pass Method?", ["Draft, Edit, Publish", "Generate, Critique, Refine", "Plan, Execute, Review", "Research, Write, Format"], 1, "Generate → Critique → Refine."),
        q("Why is refining within the same conversation better than restarting?", ["It's faster", "AI retains context and each refinement narrows the solution", "No real difference", "Restarting is always better"], 1, "Refining preserves accumulated context and progressively improves output."),
        q("What is meta-prompting?", ["Writing very long prompts", "Asking AI to improve your prompt before executing the task", "Prompting in another language", "Using multiple AI models at once"], 1, "Meta-prompting uses AI to audit and improve your prompt technique."),
        q("When should you restart rather than refine?", ["After every 3 messages", "When the entire direction is wrong or AI is confused after many messages", "Never restart", "Whenever the output isn't perfect"], 1, "Restart when the foundation is wrong or context has gotten muddled."),
        q("Which iteration command forces AI to prioritize the most important information?", ["Make it longer", "Cut this by 50%", "Add more examples", "Use simpler words"], 1, "'Cut by 50%' forces AI to keep only the highest-value content."),
      ],
    },
  },

  /* ── L5 — Putting It All Together: Real-World Prompt Engineering ── */
  {
    id: "m1-l5", moduleId: "mod-1", title: "Putting It All Together: Real-World Prompt Engineering", order: 5, xpReward: 75,
    content: `## Putting It All Together: Real-World Prompt Engineering

This is your capstone lesson for Module 1. Everything you've learned — C.R.A.F.T., Context Stacking, Role Levels, RACE, Chain-of-Thought, and the 3-Pass Method — comes together here.

### Your Prompt Engineering Toolkit (Review)

| Tool | When to Use | Lesson |
|---|---|---|
| C.R.A.F.T. | Every prompt — your base framework | L1 |
| 5-Layer Context Stack | When you need precise, grounded output | L2 |
| Level 3 Roles | When generic output isn't good enough | L2 |
| RACE | Quick tasks that need speed | L3 |
| Chain-of-Thought | Complex decisions and analysis | L3 |
| 3-Pass Method | Improving any AI output | L4 |
| Meta-Prompting | When you want AI to audit your technique | L4 |

### The 5 Most Common Prompt Mistakes

| Mistake | Fix |
|---|---|
| Too vague ("Help me with marketing") | Add all 5 C.R.A.F.T. elements |
| No role assigned | Always start with "Act as…" |
| Accepting first output | Use the 3-Pass Method |
| Dumping everything at once | Break complex tasks into sequential prompts |
| No format specified | Always include output structure |

### Real-World Workflow: Product Launch Email Sequence

Here's how an expert would handle a multi-step business task:

**Prompt 1 (C.R.A.F.T. + CoT):** "[C] I run a small skincare brand launching a new SPF moisturizer next month. We have 2,000 email subscribers, mostly women 25-40. [R] Act as an email marketing strategist who's launched 50+ product campaigns for DTC beauty brands. [A] Plan a 4-email launch sequence. Think step by step: what's the goal of each email, when to send it, and why that order works. [F] Table: Email # | Subject Line | Goal | Send Timing | Key Content. [T] Exciting but not salesy. Avoid ALL CAPS or excessive exclamation points."

**Prompt 2 (Critique):** "Review the sequence. Are there any gaps in the customer journey? Which subject line is weakest?"

**Prompt 3 (Refine):** "Rewrite the weakest subject line with 3 alternatives. Add a 5th 'last chance' email for non-openers."

### Pro Strategies for Business Use

- **Batch similar tasks** — Write 5 emails in one prompt, not 5 separate conversations
- **Create reusable templates** — Save your best C.R.A.F.T. prompts as templates for recurring tasks
- **Use AI to prep for AI** — "What information would you need from me to write an excellent [X]?"
- **Version your prompts** — Keep a doc of prompts that worked well for your business

> **Key takeaway:** Prompt engineering isn't about memorizing tricks — it's about systematic thinking. C.R.A.F.T. + iteration = consistently excellent AI output for any business task.`,
    sandbox: {
      task: "Write a complete multi-prompt workflow for a real business scenario. Include: (1) A C.R.A.F.T. prompt with Level 3 Role and 5-Layer Context, (2) A Chain-of-Thought element for complex reasoning, (3) A follow-up critique prompt, (4) A refinement prompt. This should read like a real conversation you'd have with AI.",
      context: "This is your Module 1 capstone. Show mastery of everything: C.R.A.F.T., context stacking, role levels, CoT, and the 3-Pass Method. Pick any small business scenario.",
      criteria: [
        { name: "C.R.A.F.T. elements", description: "All 5 elements present", keywords: ["context", "role", "action", "format", "tone", "[C]", "[R]", "[A]", "[F]", "[T]", "act as"], weight: 20 },
        { name: "Level 3 Role + Context Stack", description: "Deep role and layered context", keywords: ["experience", "specializ", "years", "industry", "company", "situation", "audience", "philosophy"], weight: 20 },
        { name: "Chain-of-Thought", description: "Step-by-step reasoning", keywords: ["step by step", "step 1", "step 2", "think through", "analyze", "first", "then", "reasoning"], weight: 20 },
        { name: "Critique follow-up", description: "Asks AI to evaluate", keywords: ["review", "critique", "weak", "missing", "improve", "gap", "evaluate", "what's wrong"], weight: 15 },
        { name: "Refinement follow-up", description: "Specific improvement instructions", keywords: ["rewrite", "refine", "revise", "improve", "change", "update", "add", "based on"], weight: 15 },
      ],
      minLength: 200, passingScore: P_SAND,
    },
    quiz: {
      passingPercent: P_QUIZ,
      questions: [
        q("What's the FIRST thing you should do when writing any prompt?", ["Ask AI what it thinks", "Apply the C.R.A.F.T. framework", "Write as much as possible", "Use Chain-of-Thought"], 1, "C.R.A.F.T. is your base framework for every prompt."),
        q("What's the biggest mistake beginners make with AI?", ["Using the wrong AI model", "Accepting the first output without iterating", "Writing prompts that are too long", "Not paying for premium"], 1, "The 3-Pass Method (Generate → Critique → Refine) dramatically improves output."),
        q("A complex task needing deep analysis should use:", ["RACE only", "C.R.A.F.T. only", "C.R.A.F.T. + Chain-of-Thought + 3-Pass iteration", "No framework — just ask directly"], 2, "Complex tasks benefit from C.R.A.F.T. structure + CoT reasoning + iteration."),
        q("What does 'Use AI to prep for AI' mean?", ["Run two AI models simultaneously", "Ask AI what information it needs before you write the real prompt", "Let AI write all prompts automatically", "Use AI to check your spelling"], 1, "Asking 'What info do you need to write an excellent X?' fills gaps in your context."),
        q("Which combination produces the most expert-level AI output?", ["Longer prompts", "Level 3 Role + 5-Layer Context + CoT + 3-Pass Method", "Shorter prompts with more conversations", "Using technical jargon"], 1, "Combining all Module 1 techniques produces consistently expert-level output."),
      ],
    },
  },
];

/* ═══════════════════════════════════════════════
   MODULE 2 — Data & Analysis (FREE)
   ═══════════════════════════════════════════════ */
const M2: Lesson[] = [
  {
    id: "m2-l1", moduleId: "mod-2", title: "AI-Powered Data Cleaning & Formatting", order: 1, xpReward: 50,
    content: `## AI-Powered Data Cleaning & Formatting

Data cleaning is where 60-80% of analysis time goes. AI accelerates this dramatically.

### What AI Can Clean
- **Inconsistent formats** — dates, phone numbers, addresses
- **Duplicate detection** — fuzzy matching ("John Smith" vs "J. Smith")
- **Missing value handling** — identifying gaps and fill strategies
- **Category standardization** — normalizing free-text to consistent categories
- **Outlier flagging** — spotting data that doesn't fit

### Key Prompt Patterns

**Format Conversion:** "Convert this data to clean CSV. Standardize dates to YYYY-MM-DD, phones to (XXX) XXX-XXXX. Remove duplicates. Flag rows with missing required fields."

**Categorization:** "Categorize these 50 feedback entries into: Bug Report, Feature Request, Praise, Complaint, Question. If unclear, label 'Review Needed'."

**Validation:** "Review this customer data for errors. Check: valid emails, phone digit count, zip codes matching cities, logical dates. Flag each error."

### Best Practices
1. Always provide sample data (5-10 rows)
2. Specify exact output format
3. Never paste PII into public AI tools
4. Verify a sample (spot-check 10%)
5. Ask AI to document all transformations for audit trails`,
    sandbox: {
      task: "Write a prompt to clean and standardize a messy customer contact list. Include sample messy data (3-5 rows) and exact output requirements.",
      context: "You manage a small business CRM with inconsistent formats and duplicates.",
      criteria: [
        { name: "Sample data", description: "Provides example data", keywords: ["john", "jane", "email", "@", "phone", "name", "example", "data", "row"], weight: 20 },
        { name: "Cleaning instructions", description: "What to standardize", keywords: ["format", "standardize", "clean", "consistent", "duplicate", "remove", "fix", "normalize"], weight: 20 },
        { name: "Output format", description: "Desired format", keywords: ["csv", "table", "column", "format", "output", "spreadsheet", "markdown"], weight: 20 },
        { name: "Specific rules", description: "Explicit formatting rules", keywords: ["date", "phone", "email", "yyyy", "format as", "should be", "must be"], weight: 20 },
      ],
      minLength: 100, passingScore: P_SAND,
    },
    quiz: {
      passingPercent: P_QUIZ,
      questions: [
        q("What % of analysis time is typically spent on data cleaning?", ["10-20%", "30-40%", "60-80%", "90-100%"], 2, "Data cleaning typically takes 60-80% of analysis time."),
        q("What is 'fuzzy matching'?", ["Cleaning blurry images", "Identifying similar but not identical records", "Random selection", "Matching colors"], 1, "Fuzzy matching finds records that refer to the same entity despite differences."),
        q("Why include sample data in cleaning prompts?", ["Make prompt longer", "So AI understands the structure and issues", "Not necessary", "Test AI counting"], 1, "Sample data shows AI the exact structure and inconsistencies."),
        q("What should you NEVER paste into public AI?", ["Company name", "Product descriptions", "Personally identifiable information (PII)", "Marketing copy"], 2, "PII should never go into public AI tools."),
        q("Why document all transformations?", ["For fun", "Create audit trail and verify changes", "Makes output longer", "AI requires it"], 1, "Documenting changes creates an audit trail for verification."),
      ],
    },
  },
  {
    id: "m2-l2", moduleId: "mod-2", title: "Spreadsheet Automation with AI", order: 2, xpReward: 50,
    content: `## Spreadsheet Automation with AI

AI transforms spreadsheet work — from formula writing to building entire analysis workflows.

### Formula Generation

Describe what you need instead of memorizing functions: "Write an Excel formula that looks up a customer in Sheet2 column A, returns total spend from column D, only if last order was within 90 days."

### The "Describe, Don't Prescribe" Approach

Instead of: "Write a VLOOKUP formula…"
Try: "I have sales data in Sheet1 and customer info in Sheet2. I need to match by customer ID and pull in region and account manager."

Describing your *goal* lets AI choose the optimal function.

### Common Tasks AI Excels At
1. Complex formulas (nested IFs, XLOOKUP, array formulas)
2. Pivot table design
3. Data transformation and restructuring
4. Google Apps Script / VBA automation
5. Dashboard chart recommendations

### Automation Scripts

"Write a Google Apps Script that runs every Monday, checks 'Orders' for last week's orders, calculates revenue by category, and emails me a summary."

### Data Validation

"Create validation rules: Column A = text only, Column B = valid email, Column C = date within 90 days, Column D = dropdown: Engineering, Sales, Marketing, Operations, HR."`,
    sandbox: {
      task: "Write a prompt asking AI to create formulas analyzing monthly sales data. Describe the data structure and specific analysis needed.",
      context: "You run a small e-commerce store with a sheet: Date, Product, Category, Qty, Unit Price, State.",
      criteria: [
        { name: "Data structure", description: "Describes the spreadsheet", keywords: ["column", "row", "sheet", "date", "product", "category", "quantity", "price"], weight: 20 },
        { name: "Specific analysis", description: "Concrete calculations", keywords: ["total", "sum", "average", "count", "revenue", "calculate", "formula", "profit"], weight: 20 },
        { name: "Goal-oriented", description: "Business goal", keywords: ["need", "want", "goal", "understand", "track", "analyze", "insight", "report"], weight: 20 },
        { name: "Output specification", description: "How to present results", keywords: ["format", "table", "summary", "chart", "dashboard", "display", "report"], weight: 20 },
      ],
      minLength: 80, passingScore: P_SAND,
    },
    quiz: {
      passingPercent: P_QUIZ,
      questions: [
        q("What is 'Describe, Don't Prescribe'?", ["Use technical names", "Describe your goal and let AI choose the function", "Write formulas yourself", "Only use basic functions"], 1, "Describing goals lets AI choose the optimal approach."),
        q("What can AI automate via Google Apps Script?", ["Only formulas", "Scheduled reports, email summaries, data validation, workflows", "Only charts", "None"], 1, "AI can write scripts for scheduled tasks, email, data processing, and workflows."),
        q("Why might AI suggest XLOOKUP over VLOOKUP?", ["They're the same", "XLOOKUP is more flexible and handles errors better", "VLOOKUP no longer works", "AI always prefers newer functions"], 1, "XLOOKUP can look left, handles errors natively, doesn't need column indexes."),
        q("What should you include in spreadsheet help prompts?", ["Only the formula", "Data structure, business goal, and desired output format", "Just sheet name", "A screenshot"], 1, "Data structure + goal + output format gives AI full context."),
        q("What's the value of data validation rules?", ["Looks professional", "Prevents bad data entry, reducing cleaning time later", "Not important", "Slows the spreadsheet"], 1, "Validation prevents errors at entry, reducing downstream cleaning."),
      ],
    },
  },
  {
    id: "m2-l3", moduleId: "mod-2", title: "Building Dashboards & Visual Reports", order: 3, xpReward: 50,
    content: `## Building Dashboards & Visual Reports

AI takes you from raw data to executive-ready visualizations.

### Choosing Charts

| Data Story | Best Chart |
|---|---|
| Trend over time | Line chart |
| Part of a whole | Pie/donut (≤5 segments) |
| Category comparison | Bar chart |
| Relationship | Scatter plot |
| Distribution | Histogram |

### Dashboard Design Principles

1. **Lead with the KPI** — most important number is largest
2. **5-second rule** — main insight grasped in 5 seconds
3. **Progressive disclosure** — summary top, details below
4. **Consistent colors** — green = good, red = attention needed
5. **No chart junk** — remove gridlines, 3D effects, decorations

### AI-Assisted Workflow

1. **Data prep** → AI cleans and formats
2. **Visualization** → AI recommends chart types
3. **Narrative** → AI drafts the story connecting visuals
4. **Refinement** → AI simplifies and clarifies`,
    sandbox: {
      task: "Write a prompt for AI to design a monthly KPI dashboard for a small business. Specify metrics, audience, and design requirements.",
      context: "You own a small online retail store and need a dashboard for team meetings.",
      criteria: [
        { name: "Metrics specified", description: "Lists KPIs", keywords: ["revenue", "sales", "customer", "conversion", "traffic", "cost", "profit", "order", "growth", "kpi"], weight: 20 },
        { name: "Audience defined", description: "Who views it", keywords: ["team", "meeting", "audience", "non-technical", "manager", "owner"], weight: 15 },
        { name: "Visual requirements", description: "Chart preferences", keywords: ["chart", "graph", "visual", "bar", "line", "pie", "color", "layout"], weight: 20 },
        { name: "Dashboard structure", description: "Layout", keywords: ["section", "top", "summary", "detail", "layout", "page", "organize", "dashboard"], weight: 15 },
        { name: "Business context", description: "Relevant context", keywords: ["retail", "store", "e-commerce", "online", "monthly", "trend", "compare"], weight: 10 },
      ],
      minLength: 100, passingScore: P_SAND,
    },
    quiz: {
      passingPercent: P_QUIZ,
      questions: [
        q("What is the '5-second rule'?", ["Load in 5 seconds", "Main insight grasped within 5 seconds", "Only 5 charts", "Update every 5 min"], 1, "The most important insight should be immediately apparent."),
        q("Best chart for trends over time?", ["Pie chart", "Bar chart", "Line chart", "Scatter plot"], 2, "Line charts clearly show direction and rate of change."),
        q("What is progressive disclosure?", ["Slowly revealing data", "Summary at top, details below for drill-down", "Using animations", "Hiding bad data"], 1, "Present high-level summary first, details available for drill-down."),
        q("Why limit pie charts to ≤5 segments?", ["Technical limitation", "More segments are hard to distinguish visually", "Only accepts 5 inputs", "No reason"], 1, "Beyond 5, slices are too small to compare effectively."),
        q("What's the recommended dashboard creation order?", ["Narrative → Visualization → Data prep", "Data prep → Visualization → Narrative → Refinement", "Everything at once", "Visualization → Data prep → Narrative"], 1, "Clean data → create visuals → add narrative → refine."),
      ],
    },
  },
  {
    id: "m2-l4", moduleId: "mod-2", title: "Market Research & Competitive Analysis", order: 4, xpReward: 50,
    content: `## Market Research & Competitive Analysis

AI transforms weeks-long research into hours-long projects.

### The AI Research Stack
1. **AI search** (Perplexity, ChatGPT Browse) — current data with citations
2. **LLMs** (Claude, GPT-4) — synthesis and framework analysis
3. **Specialized tools** (SEMrush, SimilarWeb) — competitive data

### Framework Prompts

**SWOT Analysis:** "Conduct a SWOT for [company]. Be specific — no generic statements. Include data points or concrete examples. Compare against [2-3 competitors]."

**Porter's Five Forces:** "Analyze [industry] using Porter's Five Forces. Rate each High/Medium/Low with specific 2024-2025 examples."

**Competitive Positioning:** "Map these 5 competitors on two axes: [Price: Budget→Premium] and [Features: Basic→Enterprise]. Explain each positioning."

### Market Sizing

"Estimate TAM, SAM, SOM for [product] in [market]. Bottom-up approach. Show assumptions and calculations. Cite sources."

### Best Practices
- **Triangulate** — never rely on a single AI source
- **Check dates** — AI training data has cutoffs
- **Be specific about geography** — markets vary by region
- **Ask for citations** — "Include sources for every statistic"
- **Separate facts from analysis** — label assumptions vs. verified data`,
    sandbox: {
      task: "Write a prompt for AI to conduct a competitive analysis for a small business entering a market. Use at least one strategic framework.",
      context: "You're launching a new product and need to understand the competitive landscape.",
      criteria: [
        { name: "Framework used", description: "Strategic framework applied", keywords: ["swot", "porter", "five forces", "position", "competitive", "strength", "weakness", "opportunity", "threat"], weight: 25 },
        { name: "Specific market", description: "Names a market", keywords: ["market", "industry", "sector", "niche", "space", "segment"], weight: 15 },
        { name: "Competitors", description: "Identifies competitors", keywords: ["competitor", "rival", "alternative", "compare", "vs", "against", "brand", "player"], weight: 20 },
        { name: "Actionable output", description: "Asks for actionable insights", keywords: ["recommend", "action", "strategy", "opportunity", "advantage", "differentiat", "position"], weight: 20 },
      ],
      minLength: 100, passingScore: P_SAND,
    },
    quiz: {
      passingPercent: P_QUIZ,
      questions: [
        q("What does 'triangulate' mean in research?", ["Use three models", "Cross-reference claims across multiple sources", "Search three websites", "Ask the same question three times"], 1, "Triangulation verifies by cross-referencing multiple independent sources."),
        q("What does TAM stand for?", ["Total Addressable Market", "Targeted Audience Metrics", "Top Acquisition Method", "Technology Adoption Model"], 0, "TAM = Total Addressable Market."),
        q("Why separate facts from analysis?", ["Longer output", "So you can verify factual claims and know which parts are assumptions", "They're the same", "AI can't do analysis"], 1, "Separating lets you verify data independently and understand what's assumed."),
        q("Best tool for current data with citations?", ["Standard LLM without internet", "AI search tools like Perplexity", "A calculator", "Email"], 1, "AI search tools retrieve and cite current data."),
        q("Why specify geography in research?", ["Not important", "Market dynamics vary dramatically by region", "AI only knows US", "Formatting only"], 1, "Market size, competition, regulations vary significantly by region."),
      ],
    },
  },
  {
    id: "m2-l5", moduleId: "mod-2", title: "Financial Forecasting & Trend Analysis", order: 5, xpReward: 75,
    content: `## Financial Forecasting & Trend Analysis

AI helps build forecasts and spot trends that previously required expensive analysts.

### Forecast Types
- **Revenue projections** — based on historical data and growth assumptions
- **Cash flow forecasts** — predicting inflows/outflows over 3-12 months
- **Demand forecasting** — predicting product demand by season
- **Budget scenarios** — best-case, base-case, worst-case models

### Scenario Analysis Pattern

"Given this data: [12 months revenue]. Build 3 scenarios for next 6 months:
1. **Conservative** — 2% monthly growth
2. **Base case** — maintain last 3 months' average growth
3. **Optimistic** — 8% growth if marketing succeeds

Show month-by-month projections in a table with 6-month totals."

### Trend Detection

"Review 24-month sales data: [data]. Identify: (1) overall trend, (2) seasonal patterns, (3) anomalies, (4) external factor correlations. Present with specific data points."

### Critical Disclaimers
- AI forecasts are **models, not predictions**
- Always **sensitivity-test** key assumptions
- Use as **starting points for discussion**, not final budgets
- **Never make major financial decisions solely on AI output**`,
    sandbox: {
      task: "Write a prompt for a 6-month cash flow forecast. Include sample historical data (3+ months) and request multiple scenarios.",
      context: "You run a small service business planning for next two quarters. Need best/worst cases for hiring decisions.",
      criteria: [
        { name: "Historical data", description: "Sample data included", keywords: ["month", "january", "revenue", "data", "last", "$", "income", "expense"], weight: 20 },
        { name: "Multiple scenarios", description: "Different scenarios", keywords: ["scenario", "best case", "worst case", "conservative", "optimistic", "base case"], weight: 20 },
        { name: "Specific assumptions", description: "Clear assumptions", keywords: ["assume", "growth", "rate", "percent", "%", "increase", "decrease"], weight: 20 },
        { name: "Actionable output", description: "Connected to decisions", keywords: ["hiring", "invest", "decision", "plan", "budget", "recommend", "cash flow", "runway"], weight: 20 },
      ],
      minLength: 120, passingScore: P_SAND,
    },
    quiz: {
      passingPercent: P_QUIZ,
      questions: [
        q("What's most important about AI forecasts?", ["Always accurate", "They're models based on assumptions, not guaranteed predictions", "Replace accountants", "Only work with large data"], 1, "Forecasts depend on your assumptions — not guarantees."),
        q("What is sensitivity testing?", ["Testing AI sensitivity", "Checking what happens when you change key assumptions", "Making models more accurate", "Using emotional prompts"], 1, "Varying assumptions to see how much forecasts change."),
        q("What should forecasting prompts always include?", ["Bank account number", "Historical data AND explicit assumptions", "Only future goals", "Nothing"], 1, "AI needs historical data + explicit assumptions to project."),
        q("Why request multiple scenarios?", ["Longer output", "Understand the range of outcomes and plan contingencies", "AI needs them", "One scenario is enough"], 1, "Multiple scenarios show the range of possibilities."),
        q("Which ratios assess short-term financial health?", ["Brand awareness", "Current ratio and quick ratio", "Social media followers", "Employee satisfaction"], 1, "Current and quick ratios assess ability to pay short-term obligations."),
      ],
    },
  },
];

/* ═══════════════════════════════════════════════
   MODULE 3 — Business Writing (PRO)
   ═══════════════════════════════════════════════ */
const M3: Lesson[] = [
  {
    id: "m3-l1", moduleId: "mod-3", title: "Professional Emails & Client Communications", order: 1, xpReward: 50,
    content: `## Professional Emails & Client Communications

AI helps you write faster, more clearly, and more persuasively.

### The Email Framework
1. **Subject** — specific, actionable
2. **Opening** — context + why (1-2 sentences)
3. **Body** — the ask/update (concise, scannable)
4. **CTA** — what you need from the recipient
5. **Close** — next steps and timeline

### AI Prompt Patterns

**Cold outreach:** "Write a cold email to [role] at [company type]. Our [product] helps them [benefit]. Under 100 words. No salesy language. Low-commitment CTA."

**Difficult conversations:** "Write to a client about a project delay. Due Friday, need 5 more days. Reason: [X]. Tone: apologetic but confident. Include prevention plan and revised timeline."

**Follow-ups:** "Write follow-up #3 to an unresponsive prospect. Reference [topic]. Under 75 words. Provide value instead of just 'checking in.'"

### Tone Calibration
- **Formal** → board, legal, compliance
- **Professional + warm** → clients, partnerships
- **Direct** → internal team, deadlines
- **Empathetic** → complaints, difficult news
- **Persuasive** → sales, change management

### Mistakes to Avoid
- Don't let AI make promises you can't keep
- Always review client emails before sending
- Remove AI-isms ("I hope this finds you well")
- Add personal touches`,
    sandbox: {
      task: "Write a prompt for AI to draft a professional email handling a difficult business situation. Specify relationship, situation, tone, and desired outcome.",
      context: "You need to communicate a price increase, delay, scope change, or service issue.",
      criteria: [
        { name: "Situation described", description: "Describes the difficulty", keywords: ["delay", "price", "increase", "change", "issue", "problem", "scope", "deadline"], weight: 20 },
        { name: "Relationship context", description: "Business relationship", keywords: ["client", "partner", "customer", "vendor", "relationship", "account"], weight: 15 },
        { name: "Tone specified", description: "Communication tone", keywords: ["tone", "professional", "empathetic", "apologetic", "confident", "warm", "direct"], weight: 20 },
        { name: "Desired outcome", description: "What email should achieve", keywords: ["outcome", "goal", "maintain", "trust", "solution", "next step", "CTA", "action"], weight: 20 },
        { name: "Constraints", description: "Boundaries set", keywords: ["word", "short", "under", "avoid", "keep", "concise", "brief"], weight: 5 },
      ],
      minLength: 100, passingScore: P_SAND,
    },
    quiz: {
      passingPercent: P_QUIZ,
      questions: [
        q("What should every professional email end with?", ["Fun emoji", "Clear CTA with next steps and timeline", "An apology", "Your resume"], 1, "Always include a clear CTA and next steps."),
        q("Why is 'just checking in' bad for follow-ups?", ["It's professional", "It provides no value and no reason to respond", "Too short", "Too informal"], 1, "Effective follow-ups provide value."),
        q("What are 'AI-isms'?", ["Technical terms", "Generic phrases like 'I hope this finds you well' that feel robotic", "All adjectives", "Numbers"], 1, "Overused generic phrases that signal AI-generated content."),
        q("Best tone for communicating a delay?", ["Casual, joking", "Apologetic but confident with revised timeline", "Angry, defensive", "Extremely legalistic"], 1, "Acknowledge impact, show competence, provide clear path forward."),
        q("Why review AI emails before sending?", ["Add words", "AI may make promises you can't keep or miss context", "Not necessary", "Legal only"], 1, "AI doesn't know your exact situation or relationship nuances."),
      ],
    },
  },
  {
    id: "m3-l2", moduleId: "mod-3", title: "Reports, Proposals & White Papers", order: 2, xpReward: 50,
    content: `## Reports, Proposals & White Papers

Long-form documents deliver the biggest time savings — days to hours.

### Document Architecture Prompt
"Create a detailed outline for a [type] about [topic]. Audience: [who]. Length: [X]. Include: executive summary, key sections with subheadings, evidence needs per section, conclusion structure."

### Report Writing Workflow
1. **Outline** → AI generates; you approve/modify
2. **Section by section** → separate prompts for quality
3. **Data integration** → paste data, AI writes narrative
4. **Executive summary last** → summarizes the complete document
5. **Tone pass** → ensure consistent voice

### Proposal Template Prompt
"Write a proposal for [service] to [client type]. Include: executive summary, problem statement, proposed solution, methodology, timeline, investment/pricing, expected outcomes, next steps. Confident but not arrogant. [X] pages."

### White Paper Rules
- Hook with a **problem**, not your product
- Use **data extensively** with citations
- Provide **genuine value** regardless of whether they buy
- **Soft CTA only** — "Learn more at…"

### Quality Checklist
- [ ] Clear thesis in first paragraph?
- [ ] Every section supports main argument?
- [ ] Data verified?
- [ ] Consistent formatting and voice?
- [ ] Executive summary stands alone?`,
    sandbox: {
      task: "Write a prompt for AI to create a business proposal outline for a service offering to a corporate client.",
      context: "You want to win a contract with a larger company. Your proposal must be professional and persuasive.",
      criteria: [
        { name: "Service described", description: "Specific service", keywords: ["service", "solution", "consulting", "management", "design", "development", "marketing", "training"], weight: 15 },
        { name: "Proposal sections", description: "Key sections included", keywords: ["executive summary", "problem", "solution", "methodology", "timeline", "pricing", "investment", "outcome"], weight: 25 },
        { name: "Client-focused", description: "Frames around client needs", keywords: ["client", "their", "problem", "challenge", "need", "pain point", "goal", "benefit"], weight: 20 },
        { name: "Professional specs", description: "Tone/format specified", keywords: ["professional", "tone", "page", "length", "format", "confident", "section"], weight: 20 },
      ],
      minLength: 100, passingScore: P_SAND,
    },
    quiz: {
      passingPercent: P_QUIZ,
      questions: [
        q("Why write the executive summary last?", ["Doesn't matter", "It summarizes the whole document, which isn't done yet", "Not important", "AI can't write summaries first"], 1, "Summarize after all sections are written."),
        q("Key difference: white paper vs. proposal?", ["White papers are longer", "White papers educate; proposals directly pitch a service", "No difference", "Proposals are more formal"], 1, "White papers provide value; proposals pitch solutions."),
        q("Why frame pricing as 'investment'?", ["Hide the cost", "'Investment' implies the client gains value, not just spends", "Sounds fancier", "Legal requirement"], 1, "Shifts mindset from expense to return on value."),
        q("Best approach for long reports with AI?", ["One massive prompt", "Outline first, then section by section", "Skip outline", "Let AI decide everything"], 1, "Section-by-section gives focused context for better quality."),
        q("What should a white paper's first paragraph do?", ["Introduce your company", "Hook with a compelling problem statement", "List products", "Provide a discount"], 1, "Lead with a problem the reader cares about."),
      ],
    },
  },
  {
    id: "m3-l3", moduleId: "mod-3", title: "SOPs & Internal Documentation", order: 3, xpReward: 50,
    content: `## SOPs & Internal Documentation

Clear internal docs are the foundation of scalable operations.

### SOP Template Prompt
"Create an SOP for [process]. Include: purpose, scope, roles, step-by-step procedure with decision points, tools/resources, quality checks, troubleshooting guide, revision history format."

### AI Documentation Workflow
1. **Brain dump** — describe the process however messy
2. **Structure** — AI organizes into proper SOP format
3. **Gap analysis** — "What steps or edge cases am I missing?"
4. **Simplify** — "Rewrite step 4 so someone with zero context can follow it"
5. **Test** — have someone follow the SOP, note where they get stuck

### Policy Writing
"Write a [remote work / expense / social media] policy for a [size] company in [industry]. Include: purpose, scope, guidelines, exceptions process, enforcement, effective date. Clear non-legal language."

### Documentation Best Practices
- **Write for the newest employee** — assume zero context
- **Use numbered steps** — not paragraphs
- **Include screenshots/visuals** — "Suggest where screenshots would help"
- **Add decision trees** — "Create an if/then flowchart for [process]"
- **Version control** — include revision dates and change logs
- **Review cycle** — SOPs should be reviewed quarterly`,
    sandbox: {
      task: "Write a prompt for AI to create an SOP for a common small business process. Include all key SOP sections.",
      context: "Your business is growing and you need to document processes so new hires can follow them independently.",
      criteria: [
        { name: "Process identified", description: "Names specific process", keywords: ["onboarding", "order", "customer", "invoice", "support", "shipping", "inventory", "process", "procedure"], weight: 15 },
        { name: "SOP sections", description: "Key SOP components", keywords: ["purpose", "scope", "step", "role", "tool", "checklist", "troubleshoot", "quality", "decision"], weight: 25 },
        { name: "Audience awareness", description: "Written for new employees", keywords: ["new", "hire", "employee", "anyone", "zero context", "no experience", "beginner", "clear", "simple"], weight: 20 },
        { name: "Practical elements", description: "Practical additions", keywords: ["screenshot", "example", "visual", "flowchart", "template", "checklist", "if/then", "decision tree"], weight: 20 },
      ],
      minLength: 100, passingScore: P_SAND,
    },
    quiz: {
      passingPercent: P_QUIZ,
      questions: [
        q("What's the first step in the AI documentation workflow?", ["Format perfectly", "Brain dump — describe the process however messy", "Create a template", "Hire a writer"], 1, "Start by dumping everything you know; AI structures it."),
        q("Who should SOPs be written for?", ["Only managers", "The newest employee — assume zero context", "Only senior staff", "External clients"], 1, "SOPs should be followable by someone with no prior knowledge."),
        q("What should you ask AI after drafting an SOP?", ["Is it long enough?", "What steps or edge cases am I missing?", "Is the font right?", "How much to charge?"], 1, "Gap analysis catches missing steps and edge cases."),
        q("How often should SOPs be reviewed?", ["Never — once is enough", "Quarterly", "Every 5 years", "Only when something breaks"], 1, "Quarterly reviews keep SOPs current as processes evolve."),
        q("Why include decision trees in SOPs?", ["Decoration", "They guide employees through conditional steps (if X, then Y)", "Required by law", "AI can't write them"], 1, "Decision trees help employees handle different scenarios without supervisor help."),
      ],
    },
  },
  {
    id: "m3-l4", moduleId: "mod-3", title: "Marketing Copy & Brand Voice", order: 4, xpReward: 50,
    content: `## Marketing Copy & Brand Voice

AI can produce marketing content at scale — but only if you teach it your brand voice first.

### Defining Brand Voice for AI

Before ANY marketing prompt: "Our brand voice is [adjectives]. We sound like [example brand/person]. We NEVER [what to avoid]. Our target audience is [who]. Example of our voice: [paste a paragraph you love]."

### Copy Types AI Excels At
- **Social media posts** — multiple platform variants from one brief
- **Ad copy** — headlines, descriptions, CTAs for Google/Meta
- **Product descriptions** — consistent, benefit-driven listings
- **Email marketing** — subject lines, body copy, sequences
- **Website copy** — landing pages, about pages, feature descriptions

### The Variation Prompt
"Write 5 variations of [copy type] for [product/service]. Each should: hit the same key benefit, use different hooks/angles, stay under [X] words, match our brand voice [defined above]. Label each with the angle used."

### A/B Testing with AI
"Write two versions of this [ad/email/headline]: Version A focuses on [pain point], Version B on [aspiration]. Same length, same CTA. I'll A/B test them."

### Common Pitfalls
- **Generic copy** — always provide brand voice context
- **Feature-focused** — push AI toward benefits, not features
- **Inconsistent voice** — save your brand voice doc and paste it into every session
- **No CTA** — always specify the desired action
- **Ignoring platform norms** — LinkedIn ≠ Twitter ≠ Instagram`,
    sandbox: {
      task: "Write a prompt that includes a brand voice definition and asks AI to create marketing copy for a specific product or service in multiple variations.",
      context: "You're launching a marketing campaign and need consistent, on-brand copy across channels.",
      criteria: [
        { name: "Brand voice defined", description: "Defines brand personality", keywords: ["voice", "tone", "brand", "sound", "personality", "adjective", "we are", "we never", "style"], weight: 25 },
        { name: "Product/service named", description: "Specific product", keywords: ["product", "service", "offer", "launch", "feature", "benefit", "solution"], weight: 15 },
        { name: "Multiple variations", description: "Asks for multiple versions", keywords: ["variation", "version", "alternative", "option", "A/B", "different", "angle", "hook"], weight: 20 },
        { name: "Platform awareness", description: "Specifies platform or format", keywords: ["social", "linkedin", "instagram", "twitter", "email", "ad", "website", "post", "headline"], weight: 20 },
      ],
      minLength: 100, passingScore: P_SAND,
    },
    quiz: {
      passingPercent: P_QUIZ,
      questions: [
        q("What should you provide BEFORE any marketing prompt?", ["Payment info", "Brand voice definition with examples", "Nothing", "A detailed brief about competitors"], 1, "Always establish brand voice first for consistent output."),
        q("What's the Variation Prompt technique?", ["Writing one version", "Asking for multiple versions with different hooks/angles", "Copying competitors", "Using templates only"], 1, "Multiple variations let you compare angles and test performance."),
        q("AI marketing copy tends to be too focused on what?", ["Benefits", "Features instead of benefits", "Emotions", "Brevity"], 1, "Push AI toward benefits (what customers gain) over features (what it does)."),
        q("Why save your brand voice doc separately?", ["Organization", "So you can paste it into every AI session for consistent output", "Legal requirement", "Not necessary"], 1, "Pasting brand voice into each session ensures consistency."),
        q("What should every piece of marketing copy include?", ["A joke", "A clear CTA — the specific action you want readers to take", "A discount", "Competitor mentions"], 1, "Every copy piece needs a clear call to action."),
      ],
    },
  },
  {
    id: "m3-l5", moduleId: "mod-3", title: "Grant Writing & Funding Applications", order: 5, xpReward: 75,
    content: `## Grant Writing & Funding Applications

AI dramatically accelerates grant and funding applications — but requires careful human oversight for accuracy.

### The Grant Writing Workflow
1. **Research** — use AI to find relevant grants/funding sources
2. **Requirements** — paste the RFP/grant guidelines, ask AI to summarize key requirements
3. **Outline** — map your project to grant requirements section by section
4. **Draft** — write each section with AI, ensuring you hit every requirement
5. **Budget** — use AI to create a justified budget narrative
6. **Review** — "Compare my application to the requirements. What am I missing?"

### Key Prompt Patterns

**Finding grants:** "List grants and funding opportunities available in [year] for [type of business/project] in [location]. Include: name, amount range, deadline, and eligibility summary."

**Needs statement:** "Write a compelling needs statement for a grant application. The problem: [describe]. The affected population: [who]. Include relevant statistics. Tone: urgent but evidence-based."

**Budget narrative:** "Create a budget narrative justifying these expenses: [list items + amounts]. Explain why each is necessary, reasonable, and directly tied to project outcomes."

### Critical Rules
- **NEVER fabricate statistics** — AI will invent them. Always verify every data point.
- **Match funder's language** — paste their mission statement and ask AI to align your application
- **Be specific** — vague goals lose. Use SMART objectives (Specific, Measurable, Achievable, Relevant, Time-bound)
- **Review for AI-isms** — grant reviewers can spot AI-generated text; add your authentic voice`,
    sandbox: {
      task: "Write a prompt for AI to draft a needs statement section of a grant application for a small business or nonprofit initiative.",
      context: "You're applying for a small business grant and need a compelling, evidence-based needs statement.",
      criteria: [
        { name: "Problem described", description: "Clear problem statement", keywords: ["problem", "need", "gap", "challenge", "issue", "lack", "underserved", "barrier"], weight: 20 },
        { name: "Evidence requested", description: "Asks for data/statistics", keywords: ["statistic", "data", "evidence", "research", "number", "percent", "study", "report"], weight: 20 },
        { name: "Population identified", description: "Names affected group", keywords: ["community", "population", "people", "resident", "business", "entrepreneur", "group", "demographic"], weight: 20 },
        { name: "Grant alignment", description: "Connects to funder goals", keywords: ["grant", "funder", "mission", "align", "objective", "goal", "impact", "outcome", "SMART"], weight: 20 },
      ],
      minLength: 100, passingScore: P_SAND,
    },
    quiz: {
      passingPercent: P_QUIZ,
      questions: [
        q("What's the #1 rule when using AI for grant writing?", ["Write everything with AI", "NEVER fabricate statistics — verify every data point", "Use the longest possible language", "Skip the budget section"], 1, "AI will invent statistics. Always verify every claim."),
        q("What does SMART stand for in goal-setting?", ["Simple, Managed, Automated, Reliable, Tested", "Specific, Measurable, Achievable, Relevant, Time-bound", "Strategic, Motivated, Actionable, Reasonable, Trackable", "Standard, Monitored, Assessed, Reported, Tracked"], 1, "SMART = Specific, Measurable, Achievable, Relevant, Time-bound."),
        q("Why paste the funder's mission into your prompt?", ["To make it longer", "So AI can align your language and framing with their priorities", "Not important", "Required by law"], 1, "Matching the funder's language shows alignment with their mission."),
        q("What should you ask AI to check after drafting?", ["Word count only", "Compare application to requirements — what's missing?", "Grammar only", "Nothing"], 1, "AI can audit your application against grant requirements."),
        q("Why is authentic voice important in grants?", ["It isn't", "Grant reviewers spot AI-generated text; authentic voice builds credibility", "Only for creative grants", "Funders prefer AI"], 1, "Reviewers value authenticity. Add your genuine voice to AI drafts."),
      ],
    },
  },
];

/* ═══════════════════════════════════════════════
   MODULE 4 — Presentations (PRO)
   ═══════════════════════════════════════════════ */
const M4: Lesson[] = [
  {
    id: "m4-l1", moduleId: "mod-4", title: "AI Slide Deck Fundamentals", order: 1, xpReward: 50,
    content: `## AI Slide Deck Fundamentals

AI can outline, write, and design presentations — but the strategic framing is still yours.

### The Slide Deck Workflow
1. **Narrative first** — define your story before any slides
2. **Outline** — AI generates slide-by-slide structure
3. **Content** — AI writes speaker notes and bullet points per slide
4. **Design guidance** — AI recommends layouts, visuals, data display
5. **Refinement** — cut ruthlessly (fewer slides = better presentation)

### The "One Idea Per Slide" Rule
Each slide should communicate exactly one idea. If you need two sentences to describe what a slide is about, it needs to be split.

### Prompt for Deck Outline
"Create a [X]-slide presentation outline for [topic]. Audience: [who]. Goal: [what they should do/feel after]. For each slide, provide: title, 3 bullet points, suggested visual, and speaker notes (2-3 sentences)."

### Slide Content Rules
- **Headlines that assert** — "Revenue grew 34%" not "Revenue update"
- **Maximum 6 words per bullet** — if longer, it's a paragraph
- **One chart per slide** — with a clear takeaway headline
- **No full sentences on slides** — that goes in speaker notes
- **The 10/20/30 rule** — 10 slides, 20 minutes, 30pt minimum font`,
    sandbox: {
      task: "Write a prompt for AI to create a slide deck outline for a business presentation. Specify audience, goal, slide count, and content requirements.",
      context: "You need to present to clients, investors, or your team on a business topic.",
      criteria: [
        { name: "Audience specified", description: "Names audience", keywords: ["audience", "client", "investor", "team", "board", "stakeholder", "manager"], weight: 15 },
        { name: "Goal defined", description: "Presentation goal", keywords: ["goal", "persuade", "inform", "convince", "approve", "decision", "action", "understand"], weight: 20 },
        { name: "Slide structure", description: "Per-slide requirements", keywords: ["slide", "title", "bullet", "visual", "speaker note", "outline", "structure"], weight: 25 },
        { name: "Practical constraints", description: "Length/format specs", keywords: ["minute", "slide", "maximum", "keep", "concise", "font", "format", "10", "20"], weight: 20 },
      ],
      minLength: 100, passingScore: P_SAND,
    },
    quiz: {
      passingPercent: P_QUIZ,
      questions: [
        q("What's the 'one idea per slide' rule?", ["Put everything on one slide", "Each slide communicates exactly one idea", "Only use one word per slide", "One slide per minute"], 1, "One idea per slide keeps the audience focused."),
        q("What comes first: slides or narrative?", ["Slides", "Narrative — define your story first", "Design", "Speaker notes"], 1, "Always define the narrative before building slides."),
        q("What makes a good slide headline?", ["'Revenue Update'", "'Revenue Grew 34% YoY' — headlines that assert a finding", "'Slide 3'", "'Data'"], 1, "Assertive headlines communicate the key takeaway immediately."),
        q("What's the 10/20/30 rule?", ["10 colors, 20 fonts, 30 images", "10 slides, 20 minutes, 30pt minimum font", "10 words, 20 bullets, 30 slides", "10 charts, 20 slides, 30 minutes"], 1, "10 slides max, 20 minutes, 30pt font minimum."),
        q("Where should full sentences go?", ["On the slide", "In speaker notes — slides get bullet points only", "In the title", "Nowhere"], 1, "Slides get concise bullets; full sentences go in speaker notes."),
      ],
    },
  },
  {
    id: "m4-l2", moduleId: "mod-4", title: "Executive Summaries & Pitch Decks", order: 2, xpReward: 50,
    content: `## Executive Summaries & Pitch Decks

Pitch decks are the highest-stakes presentations. Every word matters.

### Classic Pitch Deck Structure (10-12 slides)
1. **Title** — company name, tagline, your name
2. **Problem** — the pain point (make it visceral)
3. **Solution** — your product/service
4. **Market** — TAM/SAM/SOM with credible sources
5. **Business Model** — how you make money
6. **Traction** — metrics, customers, revenue
7. **Team** — why this team wins
8. **Competition** — positioning map
9. **Financials** — projections, unit economics
10. **Ask** — what you need and what you'll do with it

### AI Prompt for Pitch Deck
"Create a 10-slide pitch deck for [company description]. We're raising [amount] for [purpose]. Our traction: [key metrics]. Use the problem→solution→market→traction→ask structure. For each slide: headline, 3-4 concise bullets, data visualization suggestion."

### Executive Summary Rules
- **One page maximum** — if they want more, they'll ask
- **Lead with the opportunity** — not your company history
- **Include the ask** — don't make them guess what you want
- **Numbers > adjectives** — "$2M revenue" beats "significant growth"

### Storytelling Techniques
- **Before/After** — "Currently X. With us, Y."
- **Stakes** — what happens if they do nothing?
- **Social proof** — name-drop customers/partners
- **Specificity** — specific numbers build credibility`,
    sandbox: {
      task: "Write a prompt for AI to create a pitch deck outline for a small business seeking investment or a loan.",
      context: "You need to present your business to potential investors, a bank, or a grant committee.",
      criteria: [
        { name: "Business described", description: "Company details", keywords: ["company", "business", "product", "service", "startup", "revenue", "customer"], weight: 15 },
        { name: "Pitch structure", description: "Standard pitch sections", keywords: ["problem", "solution", "market", "traction", "team", "financial", "ask", "competition"], weight: 25 },
        { name: "Ask defined", description: "What they need", keywords: ["raise", "funding", "investment", "loan", "amount", "use of funds", "ask", "seeking"], weight: 20 },
        { name: "Data-driven", description: "Includes metrics/data", keywords: ["metric", "number", "revenue", "customer", "growth", "data", "traction", "$", "percent"], weight: 20 },
      ],
      minLength: 100, passingScore: P_SAND,
    },
    quiz: {
      passingPercent: P_QUIZ,
      questions: [
        q("How many slides in a classic pitch deck?", ["3-5", "10-12", "25-30", "50+"], 1, "The standard pitch deck is 10-12 slides."),
        q("What should the Problem slide do?", ["List features", "Make the pain point visceral and relatable", "Show financials", "Introduce the team"], 1, "The problem slide should make the audience feel the pain."),
        q("What's the rule for executive summaries?", ["At least 5 pages", "One page maximum", "No page limit", "Minimum 3 pages"], 1, "One page max. If they want more, they'll ask."),
        q("Numbers vs. adjectives in pitches?", ["Adjectives are stronger", "Numbers build more credibility than adjectives", "They're equal", "Avoid both"], 1, "'$2M revenue' beats 'significant growth' every time."),
        q("What goes on the final pitch deck slide?", ["Thank you", "The Ask — what you need and how you'll use it", "Company logo", "Q&A"], 1, "End with a clear ask: how much, for what, expected return."),
      ],
    },
  },
  {
    id: "m4-l3", moduleId: "mod-4", title: "Data Visualization in Presentations", order: 3, xpReward: 50,
    content: `## Data Visualization in Presentations

Data slides make or break presentations. AI helps you choose, design, and narrate charts.

### Chart Selection for Presentations
- **Comparison** → horizontal bar chart
- **Trend** → line chart with trendline
- **Composition** → stacked bar or donut (≤4 segments)
- **Relationship** → scatter with annotations
- **Single metric** → big number with comparison

### The "Headline + Chart + Insight" Pattern
Every data slide needs three things:
1. **Assertive headline** — "Revenue up 34% driven by enterprise"
2. **Clean chart** — one chart, minimal decoration
3. **Bottom-line insight** — one sentence takeaway below

### AI Prompts for Data Slides

"I need to present this data: [paste]. The audience is [non-technical executives]. For each data point, recommend: (1) best chart type, (2) what the headline should assert, (3) what colors/annotations to use, (4) the one-sentence insight for the audience."

### Data Storytelling Rules
- **Show the delta, not just the current** — "+34% vs last year" not just "$1.2M"
- **Annotate inflection points** — circle and label what changed
- **Use consistent scales** — don't manipulate axes to exaggerate
- **Remove chartjunk** — no 3D, no gradient fills, minimal gridlines
- **Color with purpose** — highlight the key bar, grey the rest`,
    sandbox: {
      task: "Write a prompt for AI to recommend data visualizations for a quarterly business review presentation, including specific data you need to present.",
      context: "You're presenting Q3 results to your team or board and have multiple metrics to visualize.",
      criteria: [
        { name: "Data described", description: "Specific data listed", keywords: ["revenue", "sales", "growth", "metric", "data", "number", "customer", "quarter", "month"], weight: 20 },
        { name: "Chart guidance requested", description: "Asks for chart recommendations", keywords: ["chart", "visual", "graph", "recommend", "type", "display", "show", "best way"], weight: 20 },
        { name: "Audience specified", description: "Who sees it", keywords: ["audience", "board", "team", "executive", "non-technical", "investor", "client"], weight: 15 },
        { name: "Storytelling elements", description: "Narrative connection", keywords: ["headline", "insight", "takeaway", "story", "highlight", "key finding", "message"], weight: 25 },
      ],
      minLength: 100, passingScore: P_SAND,
    },
    quiz: {
      passingPercent: P_QUIZ,
      questions: [
        q("What are the 3 elements every data slide needs?", ["Title, data, footer", "Assertive headline, clean chart, bottom-line insight", "Chart, legend, source", "Numbers, arrows, colors"], 1, "Headline + chart + insight = complete data slide."),
        q("Why show the delta, not just the current number?", ["Looks fancier", "Context of change is more meaningful than a standalone number", "Required by law", "AI can't do standalone numbers"], 1, "'+34%' provides context that '$1.2M' alone doesn't."),
        q("What is 'chartjunk'?", ["Important data", "Unnecessary visual elements (3D, gradients, excessive gridlines)", "Chart legends", "Data labels"], 1, "Chartjunk is decorative clutter that doesn't add informational value."),
        q("How should color be used in charts?", ["As many colors as possible", "Highlight the key data point; grey out the rest", "Random colors", "Only black and white"], 1, "Purposeful color draws attention to what matters."),
        q("Best chart for comparing categories?", ["Line chart", "Pie chart", "Horizontal bar chart", "Scatter plot"], 2, "Horizontal bar charts are best for comparing categories."),
      ],
    },
  },
  {
    id: "m4-l4", moduleId: "mod-4", title: "Client Proposals & Sales Decks", order: 4, xpReward: 50,
    content: `## Client Proposals & Sales Decks

Sales decks close deals. They need to be persuasive, specific, and focused on the client.

### Sales Deck Structure
1. **Their world** — demonstrate you understand their situation
2. **The gap** — what's not working / what they're missing
3. **The bridge** — your solution connects current state to desired state
4. **How it works** — 3-step process (keep it simple)
5. **Proof** — case studies, testimonials, data
6. **The offer** — pricing, packages, what's included
7. **Next steps** — make it easy to say yes

### Client-Centric Prompting
"Create a sales deck for [our service] targeting [specific client type]. Focus 70% on THEIR problems and outcomes, 30% on our solution. Include: their current challenges, the cost of inaction, our approach (3 steps), 2 relevant case studies, and pricing options. Tone: consultative, not pushy."

### Case Study Format
"Write a case study: Situation (client's problem), Task (what they hired us for), Action (what we did), Result (specific outcomes with numbers). Under 200 words."

### Pricing Presentation
- **Always offer 3 options** — anchors the middle as "reasonable"
- **Name the packages** — not "Basic/Standard/Premium" but descriptive names
- **Lead with value** — show what they get, then the price
- **Include ROI** — "This investment typically returns X within Y months"`,
    sandbox: {
      task: "Write a prompt for AI to create a client-facing sales deck that focuses primarily on the client's problems and outcomes.",
      context: "You're preparing to pitch your services to a prospective client and want to be consultative, not salesy.",
      criteria: [
        { name: "Client focus", description: "Centered on client's problems", keywords: ["their", "client", "problem", "challenge", "pain", "need", "situation", "outcome", "result"], weight: 25 },
        { name: "Solution framing", description: "Solution as bridge", keywords: ["solution", "approach", "how", "process", "step", "method", "bridge", "help"], weight: 15 },
        { name: "Social proof", description: "Includes proof elements", keywords: ["case study", "testimonial", "result", "proof", "example", "success", "data", "ROI"], weight: 20 },
        { name: "Tone defined", description: "Consultative tone", keywords: ["consultative", "tone", "not pushy", "professional", "helpful", "partner", "trust", "advisory"], weight: 20 },
      ],
      minLength: 100, passingScore: P_SAND,
    },
    quiz: {
      passingPercent: P_QUIZ,
      questions: [
        q("What ratio of client focus vs. solution in sales decks?", ["100% solution", "70% client problems/outcomes, 30% your solution", "50/50", "70% solution, 30% client"], 1, "Focus 70% on their world, 30% on your solution."),
        q("Why offer 3 pricing options?", ["Legal requirement", "Anchors the middle option as reasonable", "Confuses buyers", "Fewer options are always better"], 1, "Three options create an anchoring effect around the middle."),
        q("What format should case studies follow?", ["Random paragraphs", "Situation, Task, Action, Result (STAR)", "Just the results", "Only the client name"], 1, "STAR format: Situation → Task → Action → Result."),
        q("What should the first slide of a sales deck show?", ["Your company logo", "The client's world — showing you understand their situation", "Pricing", "Your team"], 1, "Start with their world to show you understand them."),
        q("Why include ROI in pricing?", ["Looks good", "Reframes the price as an investment with expected returns", "Required", "Not important"], 1, "ROI shifts the conversation from cost to value returned."),
      ],
    },
  },
  {
    id: "m4-l5", moduleId: "mod-4", title: "Speaker Notes & Delivery Prep", order: 5, xpReward: 75,
    content: `## Speaker Notes & Delivery Prep

Great slides mean nothing without great delivery. AI helps you prepare.

### Speaker Notes Prompts

"For each slide in this deck, write speaker notes that: expand on the bullet points without reading them verbatim, include a transition sentence to the next slide, suggest where to pause for emphasis, and note any audience interaction moments."

### Anticipating Questions

"Based on this presentation about [topic] to [audience], list the 10 most likely questions they'll ask. For each, provide: the question, why they'd ask it, and a concise answer (2-3 sentences)."

### Rehearsal with AI

"I'm going to practice my presentation. After each section, give me feedback on: clarity, persuasiveness, confidence of language, and whether I'm staying on message. Point out any weak spots."

### Delivery Tips
- **The power pause** — pause 2-3 seconds after key points
- **Eye contact pattern** — pick 3 spots in the room
- **Energy management** — high energy for opening/closing, measured for data
- **Time anchors** — know which slide you should be on at the halfway mark
- **The backup slide deck** — 5-10 appendix slides for detailed Q&A

### Virtual Presentation Adjustments
- Camera at eye level, look into it (not the screen)
- More frequent pauses (audio lag)
- Use polls/chat for engagement every 5 minutes
- Share screen: hide notifications, close tabs, clean desktop`,
    sandbox: {
      task: "Write a prompt for AI to generate speaker notes and Q&A preparation for a business presentation on a topic of your choice.",
      context: "You have a presentation next week and want to be fully prepared for delivery and tough questions.",
      criteria: [
        { name: "Speaker notes requested", description: "Asks for delivery notes", keywords: ["speaker note", "talking point", "expand", "say", "deliver", "narrate", "transition"], weight: 20 },
        { name: "Q&A prep", description: "Anticipates questions", keywords: ["question", "Q&A", "anticipate", "likely", "ask", "answer", "prepare", "objection"], weight: 25 },
        { name: "Presentation context", description: "Describes the presentation", keywords: ["presentation", "slide", "deck", "meeting", "audience", "topic", "present"], weight: 15 },
        { name: "Delivery elements", description: "Includes delivery guidance", keywords: ["pause", "emphasis", "confidence", "energy", "transition", "engage", "interact", "practice"], weight: 20 },
      ],
      minLength: 100, passingScore: P_SAND,
    },
    quiz: {
      passingPercent: P_QUIZ,
      questions: [
        q("What should speaker notes NOT do?", ["Expand on bullets", "Read the slide bullet points verbatim", "Include transitions", "Suggest pauses"], 1, "Notes should expand on bullets, never read them word for word."),
        q("How many likely questions should you prepare for?", ["0 — wing it", "10 most likely with prepared answers", "100+", "Only 1"], 1, "Preparing for ~10 likely questions covers most scenarios."),
        q("What is a 'power pause'?", ["Stopping the presentation", "Pausing 2-3 seconds after key points for emphasis", "Taking a break", "Asking a question"], 1, "Strategic silence after key points lets them sink in."),
        q("What are backup/appendix slides for?", ["Decoration", "Detailed data for Q&A without cluttering the main deck", "Replacing broken slides", "Notes only"], 1, "Appendix slides let you answer detailed questions with supporting data."),
        q("For virtual presentations, how often should you engage the audience?", ["Never", "Every 5 minutes via polls, chat, or questions", "Only at the end", "Every 30 seconds"], 1, "Virtual audiences need engagement every ~5 minutes to stay focused."),
      ],
    },
  },
];

/* ═══════════════════════════════════════════════
   MODULE 5 — Research & Strategy (ELITE)
   ═══════════════════════════════════════════════ */
const M5: Lesson[] = [
  {
    id: "m5-l1", moduleId: "mod-5", title: "AI-Powered Deep Research Methods", order: 1, xpReward: 50,
    content: `## AI-Powered Deep Research Methods

AI research is about *structured inquiry* — not just asking questions.

### The Research Funnel
1. **Broad scan** — "What are the key trends in [industry] for 2025?"
2. **Focused drill** — "Explain [specific trend]. Who are the leaders? What data supports this?"
3. **Critical analysis** — "What are the counterarguments? Who disagrees and why?"
4. **Synthesis** — "Summarize the 3 most important findings and their business implications."

### Multi-Source Research Protocol
- Use AI search (Perplexity) for current facts with citations
- Use LLMs (Claude, GPT-4) for analysis and synthesis
- Cross-reference AI findings with primary sources
- Always check the date on cited studies/reports

### Advanced Prompts

**Literature review:** "Summarize the key academic and industry research on [topic] published since 2023. Group findings by theme. Note any contradictions between sources."

**Expert interview simulation:** "You're a [specific expert]. I'm researching [topic]. I'll ask you questions — respond with the depth and nuance of a 20-year practitioner. Cite relevant examples."

**Trend analysis:** "Analyze 5 emerging trends in [industry] that will impact [business type] in the next 2-3 years. For each: what's driving it, who's affected, and what should businesses do now."

### Research Quality Checklist
- [ ] Claims are supported by cited sources
- [ ] Multiple perspectives represented
- [ ] Recency of information verified
- [ ] AI assumptions labeled explicitly
- [ ] Counterarguments explored`,
    sandbox: {
      task: "Write a research prompt using the Research Funnel (broad scan → focused drill → critical analysis → synthesis) on a business-relevant topic.",
      context: "You need to research a topic thoroughly before making a strategic business decision.",
      criteria: [
        { name: "Funnel structure", description: "Uses research funnel stages", keywords: ["broad", "focused", "drill", "critical", "synthesis", "first", "then", "narrow", "deep"], weight: 25 },
        { name: "Specific topic", description: "Names research topic", keywords: ["trend", "market", "industry", "technology", "strategy", "topic", "research", "question"], weight: 15 },
        { name: "Source diversity", description: "Asks for multiple perspectives", keywords: ["source", "perspective", "counter", "disagree", "multiple", "evidence", "citation", "debate"], weight: 20 },
        { name: "Business application", description: "Connects to business use", keywords: ["business", "implication", "decision", "strategy", "action", "impact", "recommend", "apply"], weight: 20 },
      ],
      minLength: 120, passingScore: P_SAND,
    },
    quiz: {
      passingPercent: P_QUIZ,
      questions: [
        q("What are the 4 stages of the Research Funnel?", ["Ask, Read, Write, Publish", "Broad scan, Focused drill, Critical analysis, Synthesis", "Google, Read, Summarize, Done", "Research, Draft, Edit, Submit"], 1, "Broad scan → Focused drill → Critical analysis → Synthesis."),
        q("Why include counterarguments in research?", ["Makes it longer", "Prevents bias and builds stronger, more credible analysis", "Not important", "Only for academic work"], 1, "Counterarguments strengthen analysis by showing full perspective."),
        q("What's an 'expert interview simulation'?", ["Calling a real expert", "Asking AI to respond as a specific expert with deep domain knowledge", "Reading an interview transcript", "Using voice AI"], 1, "AI roleplays as an expert, providing nuanced responses."),
        q("Why check dates on AI-cited research?", ["Formatting", "AI may cite outdated studies; recency matters for business decisions", "Not important", "Legal requirement"], 1, "AI training data has cutoffs; cited research may be outdated."),
        q("What should you always do with AI research findings?", ["Accept them", "Cross-reference with primary sources", "Delete them", "Share without review"], 1, "Always verify AI findings against original primary sources."),
      ],
    },
  },
  {
    id: "m5-l2", moduleId: "mod-5", title: "Industry & Market Intelligence", order: 2, xpReward: 50,
    content: `## Industry & Market Intelligence

AI gives every business access to market intelligence that was once reserved for firms with research departments.

### Intelligence Types
- **Competitive intelligence** — what competitors are doing
- **Market intelligence** — industry trends, sizing, dynamics
- **Customer intelligence** — buying behavior, sentiment, needs
- **Technology intelligence** — emerging tools and platforms

### Monitoring Prompts

"Create a weekly market intelligence briefing template for [industry]. Track: (1) competitor moves, (2) regulatory changes, (3) technology developments, (4) customer sentiment shifts, (5) partnership/M&A activity. Format as a scannable 1-page digest."

### Customer Intelligence

"Analyze these 50 customer reviews of [product/competitor]: Group by theme, identify top 3 praises and top 3 complaints, spot any unmet needs, and recommend how we could address the gaps."

### Industry Report Synthesis

"I'll paste sections from [industry report]. After I share all sections: (1) Summarize the 5 key takeaways, (2) identify which findings most affect [my business type], (3) recommend 3 specific actions based on these insights."

### Building Your Intelligence System
1. Set up weekly AI research prompts (same structure each week)
2. Track competitor moves in a simple spreadsheet
3. Monitor customer review platforms monthly
4. Attend one virtual industry event quarterly
5. Synthesize findings into quarterly strategy memos`,
    sandbox: {
      task: "Write a prompt for AI to create a competitive intelligence briefing for your industry, tracking multiple intelligence dimensions.",
      context: "You want to stay informed about competitors and market shifts on a regular basis.",
      criteria: [
        { name: "Multiple intelligence types", description: "Tracks various dimensions", keywords: ["competitor", "market", "customer", "technology", "regulatory", "trend", "move", "change"], weight: 25 },
        { name: "Industry specified", description: "Names an industry", keywords: ["industry", "sector", "market", "niche", "business", "space"], weight: 15 },
        { name: "Format defined", description: "Specifies output format", keywords: ["briefing", "digest", "summary", "template", "page", "weekly", "monthly", "report"], weight: 20 },
        { name: "Actionable", description: "Connected to business decisions", keywords: ["action", "recommend", "implication", "opportunity", "threat", "respond", "strategy"], weight: 20 },
      ],
      minLength: 100, passingScore: P_SAND,
    },
    quiz: {
      passingPercent: P_QUIZ,
      questions: [
        q("What are the 4 types of business intelligence?", ["Financial, Legal, HR, IT", "Competitive, Market, Customer, Technology", "Internal, External, Public, Private", "Primary, Secondary, Tertiary, Quaternary"], 1, "Competitive, Market, Customer, Technology intelligence."),
        q("How often should you run market intelligence scans?", ["Once a year", "Weekly or monthly, depending on your industry's pace", "Only when a crisis hits", "Never — it's not worth the time"], 1, "Regular cadence (weekly/monthly) catches changes early."),
        q("What's the best use of customer review analysis?", ["Count star ratings", "Group by theme, identify praises/complaints, spot unmet needs", "Just read the good ones", "Ignore them"], 1, "Thematic analysis reveals patterns and opportunities."),
        q("Why track competitor moves in a spreadsheet?", ["Busy work", "Creates a searchable history of patterns and signals over time", "Required by law", "Not useful"], 1, "Tracking builds a pattern library for strategic insight."),
        q("How should industry reports be processed with AI?", ["Read the whole thing yourself", "Paste sections, then ask AI to summarize, identify relevance, and recommend actions", "Skip them", "Just read the executive summary"], 1, "AI synthesis extracts the most relevant insights for your business."),
      ],
    },
  },
  {
    id: "m5-l3", moduleId: "mod-5", title: "Synthesizing Sources & Fact-Checking", order: 3, xpReward: 50,
    content: `## Synthesizing Sources & Fact-Checking

AI's greatest research strength is synthesis — combining multiple sources into coherent analysis. Its greatest weakness is accuracy.

### The Synthesis Workflow
1. **Gather** — collect 3-5 source texts (articles, reports, data)
2. **Paste** — share each with AI, one at a time or together
3. **Synthesize** — "Compare these sources. Where do they agree? Where do they contradict? What does the combined evidence suggest?"
4. **Verify** — check key claims against original sources

### Fact-Checking Prompts

"Review this text for factual accuracy: [paste]. For each factual claim, rate your confidence (High/Medium/Low) and explain why. Flag any claims that need verification."

"I'm going to share a statistic: [stat]. Check: Is this plausible? What would be a likely original source? What's the most current data on this topic?"

### The Verification Hierarchy
1. **Primary sources** — original research, official data, SEC filings
2. **Authoritative secondary** — Reuters, peer-reviewed journals, government agencies
3. **Reputable analysis** — McKinsey, Gartner, established industry publications
4. **AI-generated** — useful starting point, always verify

### Red Flags in AI Research
- Exact round numbers ("exactly 73.2% of companies…")
- Citations that look plausible but can't be found
- Data from years beyond AI's training cutoff
- Overly confident language about uncertain topics
- Statistics without named sources`,
    sandbox: {
      task: "Write a prompt asking AI to synthesize information from multiple sources on a business topic, including explicit fact-checking instructions.",
      context: "You've collected several articles/reports and need AI to compare, contrast, and verify key claims.",
      criteria: [
        { name: "Multiple sources", description: "References multiple sources", keywords: ["source", "article", "report", "multiple", "compare", "contrast", "study", "data"], weight: 20 },
        { name: "Synthesis requested", description: "Asks for combined analysis", keywords: ["synthesize", "combine", "compare", "agree", "contradict", "overall", "combined", "conclusion"], weight: 25 },
        { name: "Fact-checking", description: "Explicit verification", keywords: ["verify", "fact-check", "accuracy", "confidence", "flag", "source", "claim", "evidence"], weight: 25 },
        { name: "Quality criteria", description: "Defines standards", keywords: ["credible", "primary", "original", "reliable", "current", "date", "plausible"], weight: 10 },
      ],
      minLength: 100, passingScore: P_SAND,
    },
    quiz: {
      passingPercent: P_QUIZ,
      questions: [
        q("What's AI's greatest research strength?", ["Speed", "Synthesis — combining multiple sources into coherent analysis", "Accuracy", "Data collection"], 1, "AI excels at finding patterns across multiple sources."),
        q("What's a red flag in AI-generated research?", ["Long paragraphs", "Exact statistics without named sources", "Using bullet points", "Simple language"], 1, "Precise-looking stats without sources often indicate fabrication."),
        q("What's at the top of the verification hierarchy?", ["AI analysis", "Primary sources — original research, official data", "Blog posts", "Social media"], 1, "Primary sources are the gold standard for verification."),
        q("When AI cites a source, what should you do?", ["Trust it", "Verify the source actually exists and says what AI claims", "Ignore citations", "Only check some"], 1, "AI can generate plausible-looking but non-existent citations."),
        q("What's the synthesis workflow order?", ["Synthesize, then gather", "Gather → Paste → Synthesize → Verify", "Verify → Gather → Paste", "Just ask one question"], 1, "Gather sources → share with AI → synthesize → verify."),
      ],
    },
  },
  {
    id: "m5-l4", moduleId: "mod-5", title: "Strategic Planning with AI", order: 4, xpReward: 50,
    content: `## Strategic Planning with AI

AI doesn't replace strategic thinking — it amplifies it by stress-testing ideas, modeling scenarios, and surfacing blind spots.

### Strategic Thinking Prompts

**First principles:** "Break down [business challenge] into its fundamental components. Question every assumption. What would you build from scratch if you had no legacy constraints?"

**Pre-mortem:** "It's one year from now and [initiative] has failed completely. What went wrong? List the 10 most likely causes of failure, ranked by probability."

**Scenario planning:** "Create 3 scenarios for [industry/company] over the next 3 years: (1) Best case, (2) Most likely, (3) Worst case. For each: key drivers, implications, and recommended preparations."

### Strategy Frameworks via AI

- **OKRs:** "Help me set OKRs for Q1. Our company goals are [X]. Create 3 Objectives with 3-4 Key Results each. Key Results must be measurable with specific targets."
- **Blue Ocean:** "Apply Blue Ocean Strategy to [our business]. What factors should we eliminate, reduce, raise, and create compared to industry norms?"
- **Jobs to Be Done:** "Analyze [product/service] through the JTBD framework. What functional, emotional, and social jobs are customers hiring us for?"

### AI as Devil's Advocate

"I'm planning to [strategic decision]. Argue against this decision. Find every reason it could fail, every assumption that might be wrong, and every alternative I should consider first."

This is one of AI's most valuable uses — it removes the emotional attachment you have to your own ideas.`,
    sandbox: {
      task: "Write a prompt using a pre-mortem or devil's advocate approach to stress-test a strategic business decision.",
      context: "You're about to make a major business decision and want to uncover blind spots before committing.",
      criteria: [
        { name: "Decision described", description: "Specific decision named", keywords: ["decision", "plan", "strategy", "launch", "expand", "hire", "invest", "initiative", "change"], weight: 20 },
        { name: "Contrarian approach", description: "Pre-mortem or devil's advocate", keywords: ["fail", "wrong", "risk", "argue against", "devil's advocate", "pre-mortem", "blind spot", "assumption", "weakness"], weight: 30 },
        { name: "Structured analysis", description: "Systematic evaluation", keywords: ["list", "rank", "probability", "factor", "cause", "scenario", "reason", "alternative"], weight: 20 },
        { name: "Actionable output", description: "Connected to next steps", keywords: ["prepare", "mitigate", "plan", "prevent", "alternative", "recommend", "action", "contingency"], weight: 10 },
      ],
      minLength: 100, passingScore: P_SAND,
    },
    quiz: {
      passingPercent: P_QUIZ,
      questions: [
        q("What is a pre-mortem?", ["Post-project review", "Imagining a project has ALREADY failed, then listing why", "Medical procedure", "Budget forecast"], 1, "A pre-mortem imagines failure has occurred, then identifies causes."),
        q("Why use AI as devil's advocate?", ["It's argumentative", "It removes your emotional attachment to your own ideas", "Not useful", "Only for debates"], 1, "AI provides objective pushback without personal bias."),
        q("What does 'first principles thinking' mean?", ["Following industry rules", "Breaking a problem into fundamentals and questioning every assumption", "Copying competitors", "Reading principles books"], 1, "First principles strips away assumptions to rebuild from fundamentals."),
        q("What should OKR Key Results always be?", ["Vague and inspirational", "Measurable with specific targets", "Activities (not outcomes)", "Subjective opinions"], 1, "Key Results must be measurable, specific, and time-bound."),
        q("What framework asks 'what job are customers hiring you for?'", ["SWOT", "Jobs to Be Done (JTBD)", "PEST", "Five Forces"], 1, "JTBD analyzes the functional, emotional, and social jobs customers need done."),
      ],
    },
  },
  {
    id: "m5-l5", moduleId: "mod-5", title: "Competitive Positioning & SWOT", order: 5, xpReward: 75,
    content: `## Competitive Positioning & SWOT

Your competitive position determines pricing, messaging, and strategy. AI helps you analyze it objectively.

### SWOT Done Right

Most SWOTs are useless because they're vague. Fix this with specificity:

"Conduct a SWOT for [business]. Rules: (1) Every point must include a specific example or data point, (2) Compare each weakness directly to a competitor's strength, (3) Connect each opportunity to a concrete action, (4) Rate each threat by probability and impact."

### Competitive Positioning Map

"Create a positioning map for [industry] with these axes: [Axis 1] and [Axis 2]. Place these companies: [list]. For each: explain their positioning, identify the whitespace, and recommend where [my company] should position."

### Value Proposition Canvas

"Analyze [my product/service] using the Value Proposition Canvas. Map: Customer Jobs (what they're trying to do), Pains (what frustrates them), Gains (what they want). Then map: Our Pain Relievers, Gain Creators, and Products/Services. Where are the gaps?"

### Positioning Statement Template

"Write a positioning statement for [company]: For [target customer] who [need/opportunity], [company name] is [category] that [key benefit]. Unlike [competitors], we [unique differentiator]."

### Annual Strategy Review Prompt

"Based on this competitive landscape: [paste analysis]. Recommend: (1) What to double down on, (2) What to stop doing, (3) Where to differentiate further, (4) Biggest competitive threat to prepare for, (5) One unconventional move competitors won't expect."`,
    sandbox: {
      task: "Write a prompt for a SWOT analysis that requires specific examples, competitor comparisons, and actionable connections for each point.",
      context: "You need a rigorous competitive analysis that goes beyond generic statements.",
      criteria: [
        { name: "SWOT framework", description: "Uses SWOT structure", keywords: ["strength", "weakness", "opportunity", "threat", "SWOT", "internal", "external"], weight: 20 },
        { name: "Specificity required", description: "Demands specific examples", keywords: ["specific", "example", "data", "concrete", "name", "number", "evidence", "not generic"], weight: 25 },
        { name: "Competitor comparison", description: "Compares to competitors", keywords: ["competitor", "compare", "versus", "against", "relative", "advantage", "differentiat"], weight: 20 },
        { name: "Actionable", description: "Connects to actions", keywords: ["action", "recommend", "strategy", "plan", "respond", "prepare", "invest", "double down", "stop"], weight: 15 },
      ],
      minLength: 100, passingScore: P_SAND,
    },
    quiz: {
      passingPercent: P_QUIZ,
      questions: [
        q("Why are most SWOT analyses useless?", ["Framework is bad", "They're too vague — lacking specific examples and data", "Too time-consuming", "Only for large companies"], 1, "Generic SWOTs provide no actionable insight."),
        q("What should each weakness in a SWOT be compared to?", ["Nothing", "A specific competitor's corresponding strength", "Internal goals only", "Industry average"], 1, "Comparing weaknesses to competitor strengths shows real gaps."),
        q("What is 'whitespace' on a positioning map?", ["Empty space on slides", "Unoccupied market positions that represent opportunities", "Competitor territory", "Formatting gaps"], 1, "Whitespace = market positions not occupied by competitors."),
        q("What's a positioning statement?", ["Company description", "A concise formula: For [audience] who [need], we are [category] that [benefit], unlike [competitors]", "Mission statement", "Brand tagline"], 1, "A structured statement that defines your unique market position."),
        q("What does the Value Proposition Canvas map?", ["Financial projections", "Customer Jobs, Pains, and Gains vs. your Pain Relievers, Gain Creators, and Products", "Employee satisfaction", "Market size"], 1, "It maps customer needs against your value delivery."),
      ],
    },
  },
];

/* ═══════════════════════════════════════════════
   MODULE 6 — Email & Communications (ELITE)
   ═══════════════════════════════════════════════ */
const M6: Lesson[] = [
  {
    id: "m6-l1", moduleId: "mod-6", title: "Inbox Management & Smart Triage", order: 1, xpReward: 50,
    content: `## Inbox Management & Smart Triage

The average professional spends 28% of their workday on email. AI can cut that in half.

### AI-Powered Email Triage

"Here are 10 emails I received today (subjects and first lines). Categorize each as: (1) Urgent — respond today, (2) Important — respond this week, (3) FYI — no response needed, (4) Delegate — [team member] should handle. For urgent ones, draft a brief response."

### Response Templates with AI

Build a library of templated responses for recurring email types:
- Meeting requests → availability + agenda check
- Client questions → helpful answer + upsell opportunity
- Vendor pitches → polite decline or meeting request
- Internal updates → acknowledgment + any action items

### Batch Processing Method
1. **Sort** — AI categorizes by urgency/type
2. **Draft** — AI creates response drafts for each category
3. **Review** — you edit and personalize (2 min per email vs. 10)
4. **Send** — batch send all at once

### Email Rules to Set Up
- Auto-label by sender domain (clients, vendors, internal)
- Star emails containing action words ("deadline", "ASAP", "approve")
- Snooze non-urgent items to batch processing times
- Unsubscribe ruthlessly — if you haven't opened 3 in a row, unsubscribe`,
    sandbox: {
      task: "Write a prompt for AI to triage and draft responses for a batch of emails. Create 3-5 sample email subjects/senders and ask AI to categorize and draft responses.",
      context: "You have a full inbox and need to efficiently process emails without spending all morning on it.",
      criteria: [
        { name: "Sample emails", description: "Provides example emails", keywords: ["email", "subject", "from", "regarding", "re:", "meeting", "request", "update", "question"], weight: 20 },
        { name: "Categorization system", description: "Defines categories", keywords: ["urgent", "important", "FYI", "delegate", "category", "priorit", "triage", "sort"], weight: 25 },
        { name: "Response drafting", description: "Asks for draft responses", keywords: ["draft", "respond", "reply", "response", "write", "template", "answer"], weight: 20 },
        { name: "Efficiency focus", description: "Emphasizes time savings", keywords: ["quick", "brief", "efficient", "batch", "fast", "concise", "short"], weight: 15 },
      ],
      minLength: 100, passingScore: P_SAND,
    },
    quiz: {
      passingPercent: P_QUIZ,
      questions: [
        q("What % of the workday does the average professional spend on email?", ["5%", "28%", "50%", "75%"], 1, "About 28% — nearly a third of the workday."),
        q("What's the batch processing method?", ["Reply immediately to every email", "Sort → Draft → Review → Send in batches", "Ignore all email", "Forward everything"], 1, "Batch processing: Sort, draft, review, send all at once."),
        q("When should you unsubscribe from an email list?", ["Never", "If you haven't opened the last 3 consecutive emails", "Only if they're spam", "After 1 year"], 1, "3 unopened in a row = unsubscribe."),
        q("How much time per email should batch review take?", ["10 minutes", "About 2 minutes for edit and personalization", "30 seconds", "No review needed"], 1, "AI drafts + quick personalization = ~2 min vs 10 min from scratch."),
        q("What should urgent emails be?", ["Starred for later", "Responded to today", "Deleted", "Forwarded to everyone"], 1, "Urgent = respond today."),
      ],
    },
  },
  {
    id: "m6-l2", moduleId: "mod-6", title: "Follow-Up Sequences & Drip Campaigns", order: 2, xpReward: 50,
    content: `## Follow-Up Sequences & Drip Campaigns

Systematic follow-up is the #1 driver of sales and relationship building. Most businesses give up too early.

### The Follow-Up Framework
- **Touch 1** (Day 0) — Initial outreach with value
- **Touch 2** (Day 3) — Different angle, add value
- **Touch 3** (Day 7) — Social proof or resource
- **Touch 4** (Day 14) — Break-up email ("last message unless…")
- **Touch 5** (Day 30) — Reconnect with news

### AI Sequence Builder

"Create a 5-email follow-up sequence for [purpose]. Target: [persona]. Each email should: use a different angle/hook, stay under 100 words, add value (not just 'checking in'), escalate urgency gradually, and include a clear CTA. Space them as recommended."

### Drip Campaign Types
- **Onboarding** — new customer welcome series
- **Nurture** — lead warming over weeks/months
- **Re-engagement** — win back inactive customers
- **Educational** — establish authority through value

### Key Metrics to Track
- **Open rate** — subject line effectiveness (benchmark: 20-30%)
- **Click rate** — content relevance (benchmark: 2-5%)
- **Reply rate** — personalization quality (benchmark: 1-5%)
- **Unsubscribe rate** — frequency/relevance issues (keep under 0.5%)

### Personalization at Scale
"Write 3 versions of this email: Version A for [small businesses], Version B for [mid-market], Version C for [enterprise]. Same core message, adapted language and examples for each segment."`,
    sandbox: {
      task: "Write a prompt for AI to create a multi-touch follow-up email sequence with different hooks and escalating urgency.",
      context: "You're building a sales or re-engagement sequence and need each email to add value, not just 'check in.'",
      criteria: [
        { name: "Multi-touch", description: "Multiple emails in sequence", keywords: ["sequence", "series", "touch", "email 1", "email 2", "follow-up", "step", "day"], weight: 25 },
        { name: "Different angles", description: "Each email uses different hook", keywords: ["angle", "hook", "different", "unique", "approach", "perspective", "value", "offer"], weight: 20 },
        { name: "Value-driven", description: "Provides value, not just checking in", keywords: ["value", "insight", "resource", "helpful", "benefit", "tip", "case study", "not just checking"], weight: 20 },
        { name: "Timing specified", description: "Includes spacing/timing", keywords: ["day", "week", "spacing", "timing", "schedule", "when", "after", "interval"], weight: 15 },
      ],
      minLength: 100, passingScore: P_SAND,
    },
    quiz: {
      passingPercent: P_QUIZ,
      questions: [
        q("What's the #1 mistake in follow-up?", ["Sending too many", "Giving up too early", "Using AI", "Being too polite"], 1, "Most businesses stop following up after 1-2 attempts."),
        q("What should each email in a sequence use?", ["The same message", "A different angle/hook to avoid repetition", "Longer text", "More urgency from the start"], 1, "Different hooks keep the sequence fresh and avoid annoying repetition."),
        q("What's a 'break-up email'?", ["A farewell letter", "A final email saying 'this is my last message unless...' to create urgency", "Canceling a subscription", "Spam"], 1, "Break-up emails create urgency by signaling you'll stop reaching out."),
        q("What's a good email open rate benchmark?", ["1-5%", "20-30%", "80-90%", "100%"], 1, "20-30% open rate is a solid benchmark for business email."),
        q("What are the 4 types of drip campaigns?", ["Morning, Afternoon, Evening, Night", "Onboarding, Nurture, Re-engagement, Educational", "Short, Medium, Long, Extra Long", "Email, Text, Call, Mail"], 1, "Onboarding, nurture, re-engagement, educational."),
      ],
    },
  },
  {
    id: "m6-l3", moduleId: "mod-6", title: "Client Relationship Communications", order: 3, xpReward: 50,
    content: `## Client Relationship Communications

Strong client communication is the foundation of retention. AI helps you be more consistent and thoughtful.

### Communication Cadence
- **Weekly** — active project updates
- **Bi-weekly** — retainer/ongoing service check-ins
- **Monthly** — performance reports + strategy adjustments
- **Quarterly** — business reviews + roadmap discussions
- **Ad-hoc** — celebrations, industry insights, introductions

### AI Prompt Patterns

**Project update:** "Write a client project update email. Project: [X]. What we completed this week: [list]. What's coming next week: [list]. Any blockers: [Y/N + details]. Tone: confident and transparent."

**QBR (Quarterly Business Review):** "Create a QBR email template. Include: key metrics summary, wins this quarter, areas for improvement (framed as opportunities), recommendations for next quarter, and a scheduling CTA for a review call."

**Celebration email:** "Draft a brief congratulations email to a client who just [achievement]. Reference their specific achievement. Suggest how we can help them build on this momentum."

### The Bad News Formula
1. **Acknowledge** — name the issue directly
2. **Own** — take responsibility (don't blame)
3. **Fix** — state what you're doing to resolve it
4. **Prevent** — explain how you'll prevent recurrence
5. **Timeline** — provide specific next steps and dates

### Relationship Building Touches
- Share relevant industry articles (with a personal note)
- Congratulate on company milestones
- Make introductions to people in your network
- Remember and reference personal details
- Send handwritten notes for major events`,
    sandbox: {
      task: "Write a prompt for AI to create a quarterly business review (QBR) email for a client, including metrics, wins, and forward-looking recommendations.",
      context: "You want to proactively communicate results and strengthen the relationship during your quarterly review cycle.",
      criteria: [
        { name: "Metrics included", description: "References key metrics", keywords: ["metric", "result", "number", "KPI", "performance", "data", "growth", "revenue", "conversion"], weight: 20 },
        { name: "Wins highlighted", description: "Celebrates achievements", keywords: ["win", "achievement", "success", "accomplishment", "milestone", "highlight", "positive"], weight: 15 },
        { name: "Forward-looking", description: "Includes recommendations", keywords: ["recommend", "next quarter", "plan", "strategy", "opportunity", "goal", "improve", "roadmap"], weight: 25 },
        { name: "Relationship-building", description: "Strengthens relationship", keywords: ["partner", "relationship", "value", "together", "collaborative", "trust", "appreciate"], weight: 20 },
      ],
      minLength: 100, passingScore: P_SAND,
    },
    quiz: {
      passingPercent: P_QUIZ,
      questions: [
        q("How often should active project clients get updates?", ["Monthly", "Weekly", "Quarterly", "Only when something changes"], 1, "Weekly updates keep active-project clients informed and confident."),
        q("What's the first step in delivering bad news to a client?", ["Apologize profusely", "Acknowledge — name the issue directly", "Blame someone else", "Ignore it"], 1, "Name the issue directly and honestly."),
        q("What should QBR emails include?", ["Just metrics", "Metrics, wins, areas for improvement (as opportunities), recommendations, and scheduling CTA", "Only good news", "Invoice"], 1, "QBR = metrics + wins + opportunities + recommendations + next steps."),
        q("What's a low-effort way to build client relationships?", ["Send invoices faster", "Share relevant industry articles with a personal note", "CC them on everything", "Send generic newsletters"], 1, "Sharing relevant content with a personal note shows you think of them."),
        q("In the Bad News Formula, what comes after 'Own'?", ["Apologize more", "Fix — state what you're doing to resolve it", "Blame the client", "End the email"], 1, "Acknowledge → Own → Fix → Prevent → Timeline."),
      ],
    },
  },
  {
    id: "m6-l4", moduleId: "mod-6", title: "Internal Team Communications", order: 4, xpReward: 50,
    content: `## Internal Team Communications

Clear internal communication prevents costly misunderstandings and keeps teams aligned.

### Communication Type Matching

| Situation | Best Channel |
|---|---|
| Quick question | Slack/Teams message |
| Decision needed | Structured email with options |
| Complex discussion | Meeting with AI-generated agenda |
| Status update | Async document or video |
| Announcement | All-hands or channel post |

### AI Prompt Patterns

**Meeting agenda:** "Create a 30-minute meeting agenda for [topic]. Include: objectives, discussion items with time allocations, decision points, and action items to capture. The meeting is between [roles]. Prioritize the most contentious item first."

**Status update:** "Write a project status update for the team. Project: [X]. Format: (1) TL;DR in 2 sentences, (2) What's done, (3) What's in progress, (4) Blockers, (5) Decisions needed. Keep total under 200 words."

**Announcement:** "Draft a company announcement about [change]. Tone: positive and clear. Anticipate concerns: [list likely concerns]. Address each proactively. End with FAQ section."

### Reducing Meeting Load
- **Before scheduling a meeting, ask:** "Could this be an email, document, or async video?"
- **Use AI to create meeting alternatives:** "Convert this meeting topic into an async decision document with context, options, and a voting mechanism."
- **Post-meeting:** "Summarize this meeting transcript into: decisions made, action items with owners, and open questions for follow-up."`,
    sandbox: {
      task: "Write a prompt for AI to create a structured meeting agenda that includes objectives, time allocations, and decision points.",
      context: "You're running a team meeting and want to ensure it's focused, efficient, and produces clear outcomes.",
      criteria: [
        { name: "Objectives defined", description: "Meeting goals stated", keywords: ["objective", "goal", "purpose", "outcome", "achieve", "decide", "resolve", "discuss"], weight: 20 },
        { name: "Time allocations", description: "Time per item", keywords: ["minute", "time", "duration", "allocat", "schedule", "agenda", "30 min", "15 min"], weight: 20 },
        { name: "Decision points", description: "Identifies decisions", keywords: ["decision", "decide", "vote", "approve", "choose", "option", "resolution", "action item"], weight: 20 },
        { name: "Participants/context", description: "Describes attendees/topic", keywords: ["team", "meeting", "participant", "role", "between", "topic", "about", "regarding"], weight: 20 },
      ],
      minLength: 100, passingScore: P_SAND,
    },
    quiz: {
      passingPercent: P_QUIZ,
      questions: [
        q("What should you ask before scheduling any meeting?", ["Who's available?", "Could this be an email, document, or async video?", "What room is free?", "Is the boss available?"], 1, "Many meetings should be async documents or emails instead."),
        q("What's the best format for status updates?", ["Long emails", "TL;DR + Done + In Progress + Blockers + Decisions Needed, under 200 words", "Verbal updates only", "No updates needed"], 1, "Structured, scannable format under 200 words."),
        q("When communicating change, what should you address proactively?", ["Nothing", "Anticipated concerns with clear answers", "Only the positive aspects", "Technical details"], 1, "Proactively addressing concerns prevents rumors and anxiety."),
        q("Which item should be first on a meeting agenda?", ["Easiest", "Most contentious/important — when energy is highest", "Announcements", "Roll call"], 1, "Tackle the hardest item first when attention is highest."),
        q("What should post-meeting summaries include?", ["Full transcript", "Decisions made, action items with owners, and open questions", "Just the date", "Attendee list only"], 1, "Focus on decisions, assigned actions, and unresolved items."),
      ],
    },
  },
  {
    id: "m6-l5", moduleId: "mod-6", title: "Crisis Communication & Reputation", order: 5, xpReward: 75,
    content: `## Crisis Communication & Reputation Management

When things go wrong, your communication speed and quality define the outcome.

### The Crisis Response Framework
1. **Acknowledge** (within hours) — "We're aware of [issue]"
2. **Investigate** — gather facts before making statements
3. **Communicate** (within 24h) — transparent update with what you know
4. **Resolve** — fix the problem + communicate the fix
5. **Follow up** — post-resolution summary + prevention plan

### AI Crisis Prompts

**Initial response:** "Draft an urgent customer communication about [incident]. Tone: empathetic, transparent, accountable. Include: what happened (facts only), what we're doing, when they'll hear from us next. Do NOT speculate or admit legal liability."

**Internal brief:** "Create an internal crisis brief for our team. Situation: [X]. Include: what happened, impact assessment, immediate actions, talking points for customer-facing staff, and escalation protocol."

**Post-crisis:** "Write a post-incident communication summarizing: what happened, root cause, actions taken, and changes implemented to prevent recurrence. Tone: accountable and forward-looking."

### Reputation Monitoring

"Analyze these customer reviews/social mentions about [brand]. Categorize sentiment: positive, neutral, negative. For negative mentions, identify: the core issue, severity (1-5), and recommended response."

### Rules
- **Speed over perfection** — a fast imperfect response beats a slow perfect one
- **Never lie or speculate** — stick to confirmed facts
- **One voice** — designate a single spokesperson
- **Over-communicate** — update even when there's no new info
- **Save legal review for formal statements** — initial acknowledgment doesn't need legal`,
    sandbox: {
      task: "Write a prompt for AI to draft an initial crisis response communication about a service disruption, product issue, or data incident.",
      context: "Something went wrong with your product/service and customers are affected. You need to communicate quickly.",
      criteria: [
        { name: "Incident described", description: "Describes what happened", keywords: ["incident", "issue", "disruption", "outage", "problem", "error", "breach", "failure", "delay"], weight: 15 },
        { name: "Empathetic tone", description: "Shows empathy", keywords: ["empathetic", "understand", "apologize", "sorry", "impact", "affected", "concern", "care"], weight: 20 },
        { name: "Transparency", description: "Shares known facts", keywords: ["transparent", "fact", "what happened", "cause", "know", "investigating", "confirmed", "honest"], weight: 20 },
        { name: "Next steps", description: "States what comes next", keywords: ["next", "update", "resolve", "fix", "action", "timeline", "when", "hear from us"], weight: 20 },
        { name: "Guardrails", description: "Avoids speculation/liability", keywords: ["do not", "avoid", "don't speculate", "confirmed only", "no liability", "facts only"], weight: 5 },
      ],
      minLength: 100, passingScore: P_SAND,
    },
    quiz: {
      passingPercent: P_QUIZ,
      questions: [
        q("What's the most important thing in crisis communication?", ["Perfect grammar", "Speed — fast imperfect response beats slow perfect one", "Legal review first", "Ignoring it"], 1, "Speed of response matters more than perfection."),
        q("When should you first acknowledge a crisis publicly?", ["Next week", "Within hours of becoming aware", "Never", "Only if media covers it"], 1, "Acknowledge within hours, even if you don't have all answers."),
        q("What should a crisis response NEVER include?", ["An apology", "Speculation or unconfirmed information", "A timeline", "Contact information"], 1, "Only communicate confirmed facts; speculation creates more problems."),
        q("What's the 'one voice' rule?", ["Only email", "Designate a single spokesperson for consistent messaging", "Everyone should comment", "AI handles all responses"], 1, "One spokesperson prevents contradictory messages."),
        q("What should a post-crisis summary include?", ["Just an apology", "What happened, root cause, actions taken, and prevention changes", "Nothing — move on", "Blame attribution"], 1, "Full summary: incident, root cause, resolution, prevention."),
      ],
    },
  },
];

/* ═══════════════════════════════════════════════
   MODULE 7 — Workflow Automation (MASTER)
   ═══════════════════════════════════════════════ */
const M7: Lesson[] = [
  {
    id: "m7-l1", moduleId: "mod-7", title: "Mapping Your Business Processes", order: 1, xpReward: 50,
    content: `## Mapping Your Business Processes

Before automating anything, you need to understand what you're automating.

### The Process Audit

"Help me map all recurring tasks in my [business type]. For each task: name, frequency (daily/weekly/monthly), time spent, who does it, tools used, and automation potential (High/Medium/Low). Organize by department."

### Process Documentation Prompt

"I'm going to describe a business process. Map it as: (1) Step-by-step flowchart with decision points, (2) Time estimate per step, (3) Bottleneck identification, (4) Automation candidates (which steps could be automated), (5) Quick wins vs. long-term improvements."

### The Automation Priority Matrix

| | Easy to Automate | Hard to Automate |
|---|---|---|
| **High Frequency** | DO FIRST ⭐ | Plan for later |
| **Low Frequency** | Nice to have | Skip for now |

### What to Automate First
1. **Data entry** — any manual copy/paste between systems
2. **Notifications** — alerts based on triggers
3. **Report generation** — scheduled automated reports
4. **Follow-ups** — time-based email sequences
5. **File management** — auto-organize, rename, route files

### What NOT to Automate
- Relationship-critical communications (first response to complaints)
- High-stakes decisions (hiring, firing, major purchases)
- Creative work that defines your brand
- Anything that requires empathy and judgment`,
    sandbox: {
      task: "Write a prompt for AI to help you audit and map 5-10 recurring business processes and identify automation candidates.",
      context: "You're a small business owner who wants to find which tasks to automate first for maximum time savings.",
      criteria: [
        { name: "Process listing", description: "Lists specific processes", keywords: ["process", "task", "workflow", "recurring", "daily", "weekly", "monthly", "routine"], weight: 20 },
        { name: "Time/frequency data", description: "Includes time estimates", keywords: ["time", "hour", "minute", "frequency", "how often", "spent", "takes", "per week"], weight: 20 },
        { name: "Automation assessment", description: "Asks for automation potential", keywords: ["automate", "automation", "potential", "candidate", "opportunity", "tool", "software"], weight: 20 },
        { name: "Prioritization", description: "Asks AI to prioritize", keywords: ["priority", "first", "highest", "impact", "quick win", "ROI", "rank", "important"], weight: 20 },
      ],
      minLength: 100, passingScore: P_SAND,
    },
    quiz: {
      passingPercent: P_QUIZ,
      questions: [
        q("What should you do BEFORE automating anything?", ["Buy software", "Map and document the current process", "Hire a developer", "Automate everything at once"], 1, "Understanding the process is essential before automating it."),
        q("Which tasks should be automated first?", ["Rare and complex", "High frequency + easy to automate", "Creative work", "Low frequency"], 1, "High frequency + easy = highest ROI."),
        q("What should NOT be automated?", ["Data entry", "Relationship-critical and high-stakes decisions requiring empathy", "Report generation", "Notifications"], 1, "Things requiring human empathy and judgment stay manual."),
        q("What's a 'quick win' in automation?", ["The most complex automation", "An easy-to-implement automation with immediate time savings", "Anything that takes months", "Replacing all employees"], 1, "Quick wins are easy to implement with immediate payoff."),
        q("What does the Automation Priority Matrix use?", ["Cost and complexity", "Frequency × Ease of Automation", "Revenue and profit", "Team size and budget"], 1, "The matrix plots frequency against ease of automation."),
      ],
    },
  },
  {
    id: "m7-l2", moduleId: "mod-7", title: "AI Integration & Tool Selection", order: 2, xpReward: 50,
    content: `## AI Integration & Tool Selection

The right tools make automation possible. The wrong tools create expensive headaches.

### The Modern Automation Stack

- **No-code automation** — Zapier, Make (Integromat), n8n
- **AI assistants** — ChatGPT Teams, Claude for Work, Microsoft Copilot
- **Specialized AI** — Jasper (marketing), Otter (transcription), Beautiful.ai (slides)
- **CRM + AI** — HubSpot AI, Salesforce Einstein
- **Project management** — Notion AI, Monday.com, ClickUp AI

### Tool Selection Framework

"I need a tool to automate [process]. Requirements: (1) Budget: [$/month], (2) Team size: [X], (3) Current tools it must integrate with: [list], (4) Technical skill level: [low/medium/high], (5) Scale: [volume]. Recommend 3 options with pros, cons, and pricing."

### Integration Architecture

Think in terms of **triggers** and **actions**:
- **Trigger:** New form submission → **Action:** Create CRM contact + send welcome email + assign to team member
- **Trigger:** Invoice paid → **Action:** Update spreadsheet + send thank you + tag in CRM
- **Trigger:** Weekly schedule → **Action:** Pull data + generate report + email to stakeholders

### Build vs. Buy Decision

| Factor | Build Custom | Buy SaaS |
|---|---|---|
| Unique process | ✅ | ❌ |
| Standard process | ❌ | ✅ |
| Budget <$100/mo | Consider no-code | ✅ |
| Need it this week | No-code only | ✅ |
| Long-term scale | ✅ | Depends |

### Integration Red Flags
- Tool doesn't have an API or Zapier/Make integration
- Requires IT support for basic changes
- Vendor lock-in with no data export
- Per-seat pricing that scales poorly`,
    sandbox: {
      task: "Write a prompt for AI to recommend an automation tool stack for a specific small business process, including requirements and integration needs.",
      context: "You want to automate a workflow but aren't sure which tools to use or how they fit together.",
      criteria: [
        { name: "Process described", description: "Specific process named", keywords: ["process", "workflow", "task", "automate", "currently", "manual", "time-consuming"], weight: 15 },
        { name: "Requirements listed", description: "Includes requirements", keywords: ["budget", "team", "integrate", "tool", "requirement", "need", "must", "feature"], weight: 25 },
        { name: "Multiple options", description: "Asks for comparison", keywords: ["recommend", "compare", "option", "alternative", "pros", "cons", "best", "top"], weight: 20 },
        { name: "Integration focus", description: "Considers how tools connect", keywords: ["integrate", "connect", "sync", "trigger", "action", "API", "Zapier", "Make", "workflow"], weight: 20 },
      ],
      minLength: 100, passingScore: P_SAND,
    },
    quiz: {
      passingPercent: P_QUIZ,
      questions: [
        q("What's the trigger-action model?", ["A project management framework", "An event (trigger) automatically starts a process (action)", "A sales technique", "A coding language"], 1, "Triggers start automated actions — the foundation of all automation."),
        q("When should you build custom vs. buy SaaS?", ["Always build custom", "Build for unique processes; buy for standard ones", "Always buy", "Flip a coin"], 1, "Custom for unique needs; SaaS for standard processes."),
        q("What's a red flag when evaluating tools?", ["Good documentation", "No API or integration support", "Affordable pricing", "Free trial available"], 1, "No API = no integration = automation dead end."),
        q("What are the 3 main no-code automation platforms?", ["Word, Excel, PowerPoint", "Zapier, Make (Integromat), n8n", "Gmail, Outlook, Yahoo", "Slack, Teams, Discord"], 1, "Zapier, Make, and n8n are the leading no-code automation platforms."),
        q("What's the most important integration factor?", ["Brand name", "Whether it connects to your existing tools", "Price alone", "UI design"], 1, "Integration with your existing stack is critical."),
      ],
    },
  },
  {
    id: "m7-l3", moduleId: "mod-7", title: "Building Automated Workflows", order: 3, xpReward: 50,
    content: `## Building Automated Workflows

Now it's time to build. We'll use AI to design, troubleshoot, and optimize real automation workflows.

### Workflow Design Prompt

"Design a Zapier/Make workflow for this process: [describe]. Include: trigger, each step/action, any filters or conditions, error handling, and what to do if a step fails. Draw it as a flowchart."

### Common Small Business Automations

**Lead capture → CRM → Nurture:**
Form submission → Add to CRM → Tag by source → Send welcome email → Start drip sequence → Notify sales rep

**Invoice → Payment → Follow-up:**
Invoice created → Send to client → If paid: update books + send receipt. If unpaid after 7 days: reminder. After 14 days: escalate.

**Content → Publish → Promote:**
Blog post published → Create social posts (3 platforms) → Schedule posts → Email subscribers → Log in content tracker

**Support → Triage → Resolve:**
Support email received → Categorize (AI) → If urgent: page on-call. If standard: create ticket → auto-respond with timeline.

### Building with AI Assistance

"I'm building an automation in [Zapier/Make]. Here's what I want: [describe]. Write me step-by-step instructions, including: which trigger to select, which actions to add, how to map fields between steps, and any filters/conditions I need."

### Error Handling
Every automation needs a failure plan:
- **Retry logic** — try failed steps 3 times
- **Fallback notifications** — alert a human when automation fails
- **Data validation** — check inputs before processing
- **Logging** — track every run for debugging`,
    sandbox: {
      task: "Write a prompt for AI to design a complete automated workflow for a common business process, including triggers, actions, conditions, and error handling.",
      context: "You're ready to build an automation and need a detailed, step-by-step workflow design.",
      criteria: [
        { name: "Trigger defined", description: "Names the trigger event", keywords: ["trigger", "when", "new", "received", "submitted", "created", "starts", "event"], weight: 20 },
        { name: "Actions listed", description: "Lists specific actions", keywords: ["action", "then", "send", "create", "update", "add", "notify", "move", "tag", "step"], weight: 20 },
        { name: "Conditions included", description: "Has filters/logic", keywords: ["if", "condition", "filter", "check", "only when", "unless", "branch", "decision"], weight: 20 },
        { name: "Error handling", description: "Addresses failures", keywords: ["error", "fail", "retry", "fallback", "alert", "notify", "log", "handle", "backup"], weight: 20 },
      ],
      minLength: 120, passingScore: P_SAND,
    },
    quiz: {
      passingPercent: P_QUIZ,
      questions: [
        q("What's the first thing to define in any automation?", ["The error handling", "The trigger — what event starts the workflow", "The last step", "The budget"], 1, "Every automation starts with a trigger event."),
        q("What should happen when an automation step fails?", ["Nothing", "Retry logic + human notification + logging", "Delete the data", "Stop all automations"], 1, "Failures need: retry, human alert, and logging for debugging."),
        q("What's a 'filter' or 'condition' in automation?", ["A spam filter", "Logic that determines whether to continue or branch based on criteria", "A visual effect", "An email filter"], 1, "Filters/conditions add logic: IF condition → do this, ELSE → do that."),
        q("Which automation should most small businesses build first?", ["Complex multi-step workflows", "Lead capture → CRM → nurture sequence", "Replacing all manual work", "AI content generation"], 1, "Lead capture to nurture is the highest ROI automation for most businesses."),
        q("Why is logging important in automations?", ["Compliance only", "To debug failures and track what happened in each run", "It isn't important", "To slow down the system"], 1, "Logs help you understand what happened, debug failures, and improve."),
      ],
    },
  },
  {
    id: "m7-l4", moduleId: "mod-7", title: "Custom AI Agents for Your Business", order: 4, xpReward: 50,
    content: `## Custom AI Agents for Your Business

AI agents go beyond simple automation — they can handle complex, multi-step tasks with reasoning.

### What's an AI Agent?

An AI agent is an AI system that can:
1. **Understand** natural language instructions
2. **Reason** about the best approach
3. **Take actions** using tools (search, email, databases)
4. **Iterate** based on results

### Business Agent Use Cases

- **Customer support agent** — answers FAQs, escalates complex issues, updates tickets
- **Research agent** — monitors competitors, summarizes reports, alerts on changes
- **Sales assistant agent** — qualifies leads, drafts proposals, schedules meetings
- **Operations agent** — generates reports, flags anomalies, sends alerts
- **Content agent** — drafts social posts, schedules content, tracks performance

### Building Agent Prompts

"Design an AI agent for [task]. Define: (1) Agent's role and knowledge base, (2) Tools it can access, (3) Decision-making rules (when to act vs. escalate), (4) Guardrails (what it should NEVER do), (5) Success metrics."

### Guardrails Are Critical

Every agent needs boundaries:
- **Never** send external communications without human review
- **Never** make financial commitments above $[X]
- **Always** escalate [specific situations] to a human
- **Always** log all actions taken for audit
- **Never** access or share customer PII outside approved systems

### Starting Simple

Don't build a complex agent on day one:
1. Start with a **single task** agent (e.g., FAQ answering)
2. Run in **review mode** — human approves every action
3. Gradually **expand scope** as you build confidence
4. Add **autonomy** only for well-understood, low-risk tasks`,
    sandbox: {
      task: "Write a prompt to design an AI agent for a specific business function, including role, tools, decision rules, and guardrails.",
      context: "You want to deploy an AI agent that can handle a routine business function semi-autonomously.",
      criteria: [
        { name: "Agent role defined", description: "Clear agent purpose", keywords: ["agent", "role", "purpose", "responsible", "handle", "manage", "assist", "function"], weight: 15 },
        { name: "Tools specified", description: "Lists available tools", keywords: ["tool", "access", "email", "CRM", "database", "search", "calendar", "slack", "system"], weight: 20 },
        { name: "Decision rules", description: "When to act vs escalate", keywords: ["decide", "rule", "escalate", "if", "when", "human", "approve", "threshold", "condition"], weight: 25 },
        { name: "Guardrails defined", description: "Clear boundaries", keywords: ["never", "always", "guardrail", "boundary", "limit", "restrict", "don't", "must not", "prohibited"], weight: 20 },
      ],
      minLength: 120, passingScore: P_SAND,
    },
    quiz: {
      passingPercent: P_QUIZ,
      questions: [
        q("What distinguishes an AI agent from simple automation?", ["Cost", "Agents can reason, use tools, and iterate — not just follow fixed rules", "Speed", "Nothing"], 1, "Agents reason and adapt; automation follows fixed trigger-action rules."),
        q("What's the most important thing when deploying agents?", ["Make them fully autonomous immediately", "Set clear guardrails — what the agent must never do", "Give them all system access", "Deploy to every function at once"], 1, "Guardrails prevent costly mistakes and maintain control."),
        q("How should you start with AI agents?", ["Build a complex multi-function agent", "Single task, review mode, then gradually expand", "Skip testing", "Full autonomy from day one"], 1, "Start simple, expand as you build confidence."),
        q("When should an agent escalate to a human?", ["Never", "For high-stakes decisions, unusual situations, or when confidence is low", "Always", "Only on Fridays"], 1, "Escalation rules for high-risk or novel situations are essential."),
        q("What must every agent action include?", ["A fun message", "Logging for audit and review", "A delay", "Customer notification"], 1, "All agent actions should be logged for accountability and debugging."),
      ],
    },
  },
  {
    id: "m7-l5", moduleId: "mod-7", title: "Scaling & Measuring AI ROI", order: 5, xpReward: 100,
    content: `## Scaling & Measuring AI ROI

The final piece: making sure your AI investments actually pay off and scaling what works.

### Measuring AI ROI

**Time saved = most common metric:**
Before AI: [X hours/week on task] → After AI: [Y hours/week] = [X-Y] hours saved × hourly rate = $ saved

**Revenue impact:**
- Faster response time → higher conversion rates
- Better proposals → higher win rates
- Automated nurture → more pipeline

**Quality impact:**
- Fewer errors in data/reports
- More consistent communications
- Better decision-making from deeper research

### The ROI Tracking Prompt

"Create a simple ROI tracking template for our AI tools. Track: (1) Tool name, (2) Monthly cost, (3) Hours saved per week, (4) Revenue attributed, (5) Quality improvements (qualitative), (6) ROI calculation. Include formulas."

### Scaling Playbook

**Phase 1: Pilot** (Month 1-2)
- Pick 3 highest-impact automations
- Measure baseline metrics
- Implement and track results

**Phase 2: Optimize** (Month 3-4)
- Review what's working, fix what's not
- Train team on tools and prompts
- Document best practices

**Phase 3: Expand** (Month 5-6)
- Roll out to additional processes
- Build prompt libraries for the team
- Share wins and learnings

**Phase 4: Systematize** (Ongoing)
- Monthly ROI reviews
- Quarterly tool evaluation
- Continuous prompt improvement
- New use case discovery

### The AI Adoption Curve

Most businesses follow this pattern:
1. **Excitement** — AI can do everything!
2. **Disappointment** — AI isn't as easy as expected
3. **Practicality** — finding real, measurable use cases
4. **Integration** — AI becomes part of daily workflow
5. **Optimization** — continuous improvement and expansion

> **Your goal: reach Phase 4 (Systematize) within 6 months. This course has given you the foundation. Now execute.**`,
    sandbox: {
      task: "Write a prompt for AI to create an ROI tracking system for your business's AI tools and automations, including specific metrics, formulas, and a review cadence.",
      context: "You've implemented several AI tools and automations. Now you need to prove their value and decide where to invest next.",
      criteria: [
        { name: "ROI metrics", description: "Defines measurement metrics", keywords: ["ROI", "metric", "cost", "save", "hour", "revenue", "time", "value", "return"], weight: 25 },
        { name: "Tracking structure", description: "Organized tracking system", keywords: ["track", "template", "spreadsheet", "dashboard", "table", "formula", "calculate", "measure"], weight: 20 },
        { name: "Review cadence", description: "Regular review cycle", keywords: ["monthly", "quarterly", "review", "cadence", "schedule", "regular", "ongoing", "cycle"], weight: 20 },
        { name: "Decision framework", description: "Guides investment decisions", keywords: ["decide", "invest", "expand", "cut", "scale", "prioritize", "recommend", "next"], weight: 15 },
      ],
      minLength: 100, passingScore: P_SAND,
    },
    quiz: {
      passingPercent: P_QUIZ,
      questions: [
        q("What's the most common metric for AI ROI?", ["Social media followers", "Time saved (hours × hourly rate)", "Number of prompts written", "AI model accuracy"], 1, "Time saved, converted to dollar value, is the most tangible ROI metric."),
        q("What's the goal timeline for reaching AI 'Systematize' phase?", ["1 week", "Within 6 months", "3 years", "Never"], 1, "Aim to reach systematic AI integration within 6 months."),
        q("What happens in Phase 2 (Optimize)?", ["Launch everything", "Review what works, fix what doesn't, train the team, document practices", "Give up", "Buy more tools"], 1, "Optimize: review, fix, train, document."),
        q("Which phase of the AI Adoption Curve comes after 'Excitement'?", ["Integration", "Disappointment — when AI doesn't meet inflated expectations", "Optimization", "Systematization"], 1, "Reality check: AI isn't magic, leading to a practical approach."),
        q("What should you do monthly for AI tools?", ["Nothing", "Review ROI metrics and assess tool performance", "Change all tools", "Ignore them"], 1, "Monthly ROI reviews ensure tools deliver value and inform decisions."),
      ],
    },
  },
];

/* ═══════════════════════════════════════════════
   MODULE ASSEMBLY
   ═══════════════════════════════════════════════ */

export const MODULES: Module[] = [
  {
    id: "mod-1", title: "AI Prompting", subtitle: "The C.R.A.F.T. Method", description: "Master the C.R.A.F.T. prompt framework, context stacking, role levels, and iteration.", tier: "free", order: 1, icon: "Brain", lessons: M1,
  },
  {
    id: "mod-2", title: "Data & Analysis", subtitle: "Insights & Dashboards", description: "Clean data, build spreadsheets, create dashboards, and forecast.", tier: "free", order: 2, icon: "BarChart3", lessons: M2,
  },
  {
    id: "mod-3", title: "Business Writing", subtitle: "Professional Documents", description: "Emails, proposals, SOPs, marketing copy, and grant applications.", tier: "pro", order: 3, icon: "FileText", lessons: M3,
  },
  {
    id: "mod-4", title: "Presentations", subtitle: "Decks & Delivery", description: "Slide decks, pitch decks, data visualization, and speaker prep.", tier: "pro", order: 4, icon: "Presentation", lessons: M4,
  },
  {
    id: "mod-5", title: "Research & Strategy", subtitle: "Deep Intelligence", description: "Deep research, market intelligence, fact-checking, and strategic planning.", tier: "pro", order: 5, icon: "Search", lessons: M5,
  },
  {
    id: "mod-6", title: "Email & Comms", subtitle: "Communications Mastery", description: "Inbox management, follow-ups, client relationships, and crisis comms.", tier: "pro", order: 6, icon: "Mail", lessons: M6,
  },
  {
    id: "mod-7", title: "Workflow AI", subtitle: "Automation & Scale", description: "Process mapping, tool selection, automated workflows, AI agents, and ROI.", tier: "pro", order: 7, icon: "Workflow", lessons: M7,
  },
];

/* ═══════════════════════════════════════════════
   HELPER LOOKUPS
   ═══════════════════════════════════════════════ */

export function getModule(moduleId: string): Module | undefined {
  return MODULES.find((m) => m.id === moduleId);
}

export function getLesson(lessonId: string): Lesson | undefined {
  for (const mod of MODULES) {
    const lesson = mod.lessons.find((l) => l.id === lessonId);
    if (lesson) return lesson;
  }
  return undefined;
}

export function getLessonModule(lessonId: string): Module | undefined {
  for (const mod of MODULES) {
    if (mod.lessons.some((l) => l.id === lessonId)) return mod;
  }
  return undefined;
}

/** ordered flat list of all lesson IDs */
export const ALL_LESSON_IDS: string[] = MODULES.flatMap((m) =>
  m.lessons.map((l) => l.id),
);

/** given a lessonId, return the next lesson id or null */
export function getNextLessonId(lessonId: string): string | null {
  const idx = ALL_LESSON_IDS.indexOf(lessonId);
  return idx >= 0 && idx < ALL_LESSON_IDS.length - 1 ? ALL_LESSON_IDS[idx + 1] : null;
}

/** which tier grants access to a module */
export function tierGrantsAccess(userTier: Tier, moduleTier: Tier): boolean {
  // New simplified model: free < pro/business (legacy elite/master → pro equivalent)
  const order: Tier[] = ["free", "pro", "business", "elite", "master"];
  return order.indexOf(userTier) >= order.indexOf(moduleTier);
}
