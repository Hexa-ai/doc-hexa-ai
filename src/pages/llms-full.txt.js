// /llms-full.txt — toute la documentation francaise en un seul fichier.
import { construireLlmsFull } from '../llms-full.mjs';

export async function GET() {
  return new Response(await construireLlmsFull('fr'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
