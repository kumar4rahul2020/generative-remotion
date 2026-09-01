
Hi Guys,

Welcome to this 4-part series where I take you through my Google Forward Deployed Engineer (FDE) interview experience.

In hindsight, I was able to break the interview down into an easy-to-remember mental model. The way I think of it now is that the interview followed the natural progression of an FDE working with a client. It breaks down into four phases:

- **Capability:** Initial discovery questions and building a prototype/demo.
- **Reliability:** Handling edge cases and unforeseen inputs.
- **Security:** Protecting enterprise data.
- **Scalability:** Moving the solution to production.

This is part one of the series. So, without further ado, let’s tackle the beast.

> **A CTO asks:** *"How can I solve a current business problem using AI?" What initial conversation should you have with the CTO, and how do you address factors of cost, latency, accuracy, and data?*

*Note: The interviewer deliberately kept this question abstract without presenting an exact scenario. To answer effectively, you must keep a running example prepared.*

Before building anything, I need to understand the intent. I apply the **Jobs to be Done** framework to discover the core need. I ask: *What is the problem, and who is the user? What progress are they trying to make? What does success look like?*

### The Example

Sales reps are losing momentum on live calls because they have to put prospects on hold to frantically Ctrl+F through massive, outdated product PDFs.

The rep wants the client to perceive them as a knowledgeable, trusted expert—not an unprepared amateur. However, they are afraid of the risks. They wonder: *"What if the AI gives me the wrong price and I get in trouble? How long do I have to keep the client on hold when I ask the AI a question? What if I type sensitive information into the chat? Do I have to switch screens?"*

The CTO’s concern, naturally, is whether the juice is worth the squeeze. Should they invest in something when their current manual process costs nothing? Will the sales team actually love to use this?

Deriving from these discovery questions, we get to two crucial things: our business metrics and our operational constraints.

- **The Business Metrics:** We establish that success looks like reduced average handle time, increased close rates, and high Daily Active Usage (DAU) to justify the investment.
- **The Constraints:** This process also helps us understand that the technical solution must be designed specifically to tackle the team's anxieties. We have to build a system that guarantees correct answers, returns them instantly, protects sensitive data, integrates seamlessly into the existing systems where the sales reps work, and ensures the cost does not offset the business benefits.

### The Conceptual Solution

Once the business need is clear, I explain the conceptual solution.

I briefly introduce frameworks like **RAG (Retrieval-Augmented Generation)** as they apply to their specific use case. In this system, the sales team will be able to retrieve answers by querying in natural language, and the output can be formatted however they choose. The answers will include citations to their internal documents, allowing the reps to verify that the information is grounded in reality.

Because AI cannot fix fundamentally broken data, I set realistic expectations about their current data hygiene. We discuss what level of clean-up is needed to avoid a "garbage in, garbage out" scenario, as well as implementing safeguards like "human-in-the-loop" workflows. For highly sensitive data like pricing, the UI can be designed to highlight the extracted price and force the rep to click the source link to verify it before speaking, shifting the AI from an "oracle" to a trusted assistant.

- **Addressing Latency and Cost:** Regarding wait time, a RAG system can reduce search latency from a 5-minute manual search to a 3-second AI response. Furthermore, I would challenge the CTO's assumption that the manual process is "free." By calculating the hourly rate of the sales reps multiplied by the 5 minutes wasted per call, we can compare that against the fraction-of-a-cent cost of an LLM token. The ROI becomes mathematically obvious.
- **Addressing Security:** To guarantee that enterprise data remains strictly isolated within their environment, I explain the enterprise agreements that ensure private data will never leak back to the provider or be used to train public foundational models. Using Virtual Private Clouds (VPCs) and private endpoints ensures their data never traverses the public internet and remains strictly within their secure cloud perimeter.
- **Addressing Adoption:** A tool is useless if the team rejects it. By co-developing the prototype with the actual end-users identified in step one, we ensure it integrates seamlessly into their daily workflow. Instead of a standalone web app, we will deploy this directly via API into their CRM (like Salesforce) or as a lightweight browser extension, meaning they never have to switch screens.

### Proving the Value

To conclude the initial consultation, I lay out a low-risk path to prove the solution actually works.

I ask the CTO to provide a "golden set" of benchmark queries and their expected, perfect answers. I explain that my first step will be to build a rapid prototype using those exact queries.

For example, I ask for specific questions—such as, *"What is the warranty period for the Enterprise Server in Germany?"* By building a prototype that successfully answers these specific questions, we prove the problem is technically solvable before committing to a full build.
