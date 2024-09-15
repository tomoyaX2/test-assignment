export const MAX_DOCS_COUNT = 10;

export const MAX_DOCS_SIZE = 100 * 1024 * 1024; // 100 MiB

export const ALLOWED_DOCUMENT_MIME_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
]);
