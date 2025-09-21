'use server';

/**
 * @fileOverview AI flow for generating a professional email reply.
 *
 * - generateEmailReply - A function that generates an email reply.
 * - GenerateEmailReplyInput - The input type for the function.
 * - GenerateEmailReplyOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmailTonesEnum = z.enum(['Formal', 'Friendly', 'Direct']);

const GenerateEmailReplyInputSchema = z.object({
  emailTopic: z.string().describe('The purpose or topic of the email to be written.'),
  tone: EmailTonesEnum.describe('The desired tone for the email reply.'),
});
export type GenerateEmailReplyInput = z.infer<
  typeof GenerateEmailReplyInputSchema
>;

const GenerateEmailReplyOutputSchema = z.object({
  emailBody: z
    .string()
    .describe(
      'The fully drafted email body, ready to be copied and sent. It should include a subject line, greeting, main content, and closing.'
    ),
});
export type GenerateEmailReplyOutput = z.infer<
  typeof GenerateEmailReplyOutputSchema
>;

export async function generateEmailReply(
  input: GenerateEmailReplyInput
): Promise<GenerateEmailReplyOutput> {
  return generateEmailReplyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEmailReplyPrompt',
  input: {schema: GenerateEmailReplyInputSchema},
  output: {schema: GenerateEmailReplyOutputSchema},
  prompt: `You are a professional business communication assistant. Your task is to draft a complete email based on a given topic and tone.

  The email should include a clear subject line, an appropriate greeting, a well-structured body, and a professional closing.

  Topic for the email: {{{emailTopic}}}
  Desired tone: {{{tone}}}

  Generate the complete email draft.
  `,
});

const generateEmailReplyFlow = ai.defineFlow(
  {
    name: 'generateEmailReplyFlow',
    inputSchema: GenerateEmailReplyInputSchema,
    outputSchema: GenerateEmailReplyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
