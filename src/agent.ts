import { AnthropicVertex } from "@anthropic-ai/vertex-sdk"
import { Anthropic } from "@anthropic-ai/sdk"
import { BadRequestError } from "@anthropic-ai/vertex-sdk/core/error.mjs"
import { ToolDefinition } from "./agent/types.js"

export class Agent {
  constructor(
    private client: AnthropicVertex,
    private getUserMessage: () => Promise<string>,
    private showAgentMessage: (message: string) => void,
    private showToolMessage: (message: string) => void,
    private tools: ToolDefinition[],
  ) {}

  async run() {
    const conversation: Anthropic.MessageParam[] = []

    console.log("Chat with Claude (use 'ctrl-c' to quit)")

    while (true) {
      const userMessage: Anthropic.MessageParam = {
        role: "user",
        content: await this.getUserMessage(),
      }
      conversation.push(userMessage)

      try {
        const result = await this.runInference(conversation)
        conversation.push(this.messageToMessageParam(result))

        for (const message of result.content) {
          switch (message.type) {
            case "text":
              this.showAgentMessage(message.text)
              break
          }
        }
      } catch (error) {
        console.error("Error:", error)
      }
    }
  }

  private runInference(
    conversation: Anthropic.MessageParam[],
  ): Promise<Anthropic.Message> {
    const anthropicTools: Anthropic.ToolUnion[] = this.tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      input_schema: tool.input_schema,
    }))

    return this.client.messages.create({
      model: "claude-3-7-sonnet@20250219",
      max_tokens: 1024,
      messages: conversation,
      tools: anthropicTools,
    })
  }

  private messageToMessageParam(
    message: Anthropic.Message,
  ): Anthropic.MessageParam {
    return {
      role: message.role,
      content: message.content,
    }
  }
}
