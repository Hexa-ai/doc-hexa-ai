// /en/llms-full.txt — the whole English documentation in one file.
import { construireLlmsFull } from '../../llms-full.mjs';

export async function GET() {
  return new Response(await construireLlmsFull('en'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
