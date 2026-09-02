Hi guys,

Welcome to this 4-part series where I take you through my Google Forward Deployed Engineer Role-Related Knowledge interview experience.

In hindsight, I was able to break down the interview into an easy-to-remember mental model. The way I think of it now is that the interview followed the natural progression of questions an FDE would face while working with a client. The end-to-end cycle breaks down into four phases:

* **Discovery:** The first phase, which includes initial discovery questions that identify business metrics and operational constraints, a conceptual explanation of the solution, and the proposal of running a prototype against a set of golden question-answer pairs.
* **Capability & Reliability:** The second phase of the interview was related to technical design and reliability, which tried to test how you design the solution and how to ensure that the solution works for all edge cases.
* **Security:** Once the technical feasibility is locked in, the questions naturally progressed to how to set up a secure perimeter, guardrails, and PII management.
* **Production:** And once we have secured the system, how to take it from prototype to production.

This is part one of the series where we dive into the discovery part of the interview.

The interview begins with a quick introduction, especially focused on experience in building in AI, after which the interviewer lays out the question as follows:

> *A CTO of a client company comes up to you and asks, "How can I solve a current business problem using AI?" What initial conversation should you have with the CTO, and how do you address factors of cost, latency, accuracy, and data?*

The interviewer deliberately kept this question abstract without presenting an exact scenario. To answer effectively, you must keep a running example prepared.

A strong answer needs a framework that can be applied to any given scenario. While there are many frameworks out there to break down product discovery, I apply the popular Jobs-to-be-Done framework. Based on the framework, I try to understand what the goal is that the user is trying to achieve, what are the forces pushing for this change, and what is the fear holding them back.

Let's take an example that I used to answer the interviewer.

Suppose sales reps in your company are losing momentum on live calls because they have to put prospects on hold to frantically Ctrl+F through massive product PDFs.

As a CTO, we understand that you want to reduce the time spent searching through product catalogs so that sales reps can take more calls per day. Your fear is why you should invest in something that has zero cost today, and whether the sales reps would even use it after you have made the investment. For the sales reps in your company, they want the client to perceive them as knowledgeable, trusted experts—not unprepared amateurs. However, they would be afraid of things like: *"What if the AI gives me the wrong price and I lose street cred? How long do I have to keep the client on hold when I ask the AI a question? What if I type sensitive information into the chat? Do I have to switch screens?"*

Applying the Jobs-to-be-Done framework, we get to two crucial things: our business metrics and our operational constraints.

We establish that success looks like reduced average handle time, increased close rates, and high Daily Active Usage (DAU) to justify the investment.

This process also helps us understand that the technical solution must be designed specifically to tackle the team's anxieties. We have to build a system that guarantees correct answers, returns them instantly, protects sensitive data, integrates seamlessly into the existing systems where the sales reps work, and ensures the cost does not offset the business benefits.

Once the business need is clear, the conceptual solution is inevitably easy to propose.

I briefly introduce concepts like RAG (Retrieval-Augmented Generation) as it applies to their specific use case. In this system, the sales team will be able to retrieve answers by querying in natural language. Regarding wait time, a RAG system can reduce search latency from a 5-minute manual search to a 3-second AI response that solves the top-level metric, which would increase close rates too. For adoption of the solution, we will deploy either directly via API into their CRM (like Salesforce) or as a lightweight browser extension, meaning they never have to switch screens.

Now, to address concerns about data accuracy, the answers will include citations to their internal documents, allowing the reps to verify that the information is grounded in reality. Because AI cannot fix fundamentally broken data, we will set realistic expectations about their current data hygiene. We discuss what level of cleanup is needed to avoid a "garbage in, garbage out" scenario, as well as implementing "human-in-the-loop” workflows. For example, with highly sensitive data like pricing, the UI can be designed to highlight the extracted price and force the rep to click the source link and verify it before speaking.

Once satisfied with concerns on data accuracy, we address the concerns on cost: We would calculate the hourly rate of the sales reps by the number of calls, and we can compare that against the cost of an LLM token per hour to show the increase in overall return on investment.

For concerns on security, we guarantee that enterprise data remains strictly isolated within their environment. We explain that enterprise agreements ensure private data will never leak back to the provider or be used to train foundational models. Using Virtual Private Clouds (VPCs) and private endpoints ensures their data never traverses the public internet and remains strictly within their secure cloud perimeter.

Once we address all the business metrics and how the solution handles all their concerns with respect to cost, latency, security, and adoption, we still need a way to put our money where our mouth is.

To conclude the initial consultation, I lay out a low-risk path to prove the solution actually works within the business constraints.

I ask the CTO to provide a "golden set" of benchmark queries and their expected, perfect answers. I explain that my first step will be to build a rapid prototype using those exact queries. By building a prototype that successfully answers these specific questions, we prove the problem is technically solvable before committing to a full build. This led to a natural segue of the interview into the technical design, which we are going to cover in the second part of the Google FDE RRK series.

I understand that the answer provided here is not a universal solution for FDE interviews, but the goal of this video series is to provide a framework more than just provide an answer to any specific question. Because when I had prepared over a long period of time, I was forgetting a lot of micro details closer to the interview, but what I carried with myself was a mental framework that can be applied universally across any AI engineering design interview. I hope you get the same value that I perceive this video series generating. Since I am new to this, any feedback would be deeply appreciated, as it would help me also see my video from your point of view. Thank you for watching, and I wish you all the best.
