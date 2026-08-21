import { addTypingListener } from '../route';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetConvId = searchParams.get('conversationId');

  const encoder = new TextEncoder();

  let cleanup: (() => void) | null = null;

  const stream = new ReadableStream({
    start(controller) {
      // Send initial heartbeat
      controller.enqueue(encoder.encode(': heartbeat\n\n'));

      cleanup = addTypingListener((record) => {
        if (!targetConvId || record.conversationId === targetConvId) {
          const data = JSON.stringify(record);
          try {
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          } catch (err) {
            // stream closed
          }
        }
      });
    },
    cancel() {
      if (cleanup) {
        cleanup();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
