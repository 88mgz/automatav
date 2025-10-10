export async function generateContentWithAI(spec: TopicSpec): Promise<ContentDoc> {
  console.log("[v0] generateContentWithAI: Starting with spec title:", spec.title)
  const client = getOpenAIClient()

  const systemPrompt = `You are an expert content generator for vehicle intelligence pages. You output ONLY valid JSON matching the ContentDocSchema.

Build rich, data-driven content with the following sections:
1. A "rich" section with an engaging HTML introduction (use <h2>, <p>, <ul>, <strong> tags)
2. A "spec_table" with key specifications
3. ${spec.pageType === "comparison" ? 'A "comparison_matrix" comparing the models side-by-side' : ""}
4. A "faq" section with 4-6 relevant questions and answers
5. ${spec.widgets.includeCharts ? 'At least one "chart" (bar, line, or pie) visualizing the data' : ""}
6. ${spec.widgets.includeCalculator ? 'A "calculator" for monthly payments or cost calculations (use simple formulas like: (price - downPayment) * (1 + apr/100/12) ^ termMonths / termMonths)' : ""}
7. ${spec.widgets.includeQuiz ? 'A "quiz" with 3-5 multiple choice questions to test knowledge' : ""}

Include 2-3 CTAs at the end (e.g., "Compare More Models", "Get a Quote").

Use the brand colors provided. Make content expert but ${spec.tone || "friendly"}. Target audience: ${spec.audience || "general consumers"}.

Return ONLY the JSON object, no markdown formatting.`

  const userMessage = JSON.stringify(spec, null, 2)

  try {
    console.log("[v0] generateContentWithAI: Calling OpenAI API...")
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    })

    console.log("[v0] generateContentWithAI: Received response from OpenAI")
    const responseText = completion.choices[0]?.message?.content
    if (!responseText) {
      throw new Error("No response from OpenAI")
    }

    try {
      console.log("[v0] generateContentWithAI: Parsing JSON response...")
      const json = JSON.parse(responseText)
      console.log("[v0] generateContentWithAI: Validating with Zod schema...")
      return ContentDocSchema.parse(json)
    } catch (error) {
      console.error("Failed to parse OpenAI response:", error)
      console.error("Response:", responseText)
      throw new Error("Invalid JSON response from OpenAI")
    }
  } catch (error) {
    console.error("[v0] generateContentWithAI: Error:", error)
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        throw new Error(
          "OpenAI API key is invalid or missing. Please check your OPENAI_API_KEY environment variable in the project settings.",
        )
      }
      throw error
    }
    throw new Error("Failed to generate content with OpenAI")
  }
}
</invoke>
