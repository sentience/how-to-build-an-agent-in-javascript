import { AnthropicVertex } from "@anthropic-ai/vertex-sdk"
import { Anthropic } from "@anthropic-ai/sdk"

export class Agent {
  constructor(
    private client: AnthropicVertex,
    private getUserMessage: () => Promise<string>,
    private showAgentMessage: (message: string) => void,
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
    return this.client.messages.create({
      model: "claude-3-7-sonnet@20250219",
      max_tokens: 1024,
      messages: conversation,
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
