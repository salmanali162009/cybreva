// ─────────────────────────────────────────────
//  Cybreva — AI assistant controller
// ─────────────────────────────────────────────
import ChatSession from '../models/ChatSession.js';
import { chatWithAssistant } from '../services/ai/groqService.js';
import { asyncHandler, sendSuccess, isValidObjectId } from '../utils/helpers.js';
import { AppError } from '../utils/AppError.js';
import { validate, chatSchema } from '../validators/index.js';
import { MAX_CHAT_HISTORY, AI_DISCLAIMER } from '../constants/index.js';

// ── POST /api/ai/chat ─────────────────────────
export const chat = asyncHandler(async (req, res) => {
  const { message, sessionId } = validate(chatSchema, req.body);

  // Load or create a chat session
  let session;

  if (sessionId) {
    if (!isValidObjectId(sessionId)) throw new AppError('Invalid session ID.', 400);
    session = await ChatSession.findOne({ _id: sessionId, userId: req.user._id });
    if (!session) throw new AppError('Chat session not found.', 404);
  } else {
    // Create a new session; title = first 60 chars of user message
    session = await ChatSession.create({
      userId: req.user._id,
      title: message.slice(0, 60),
      messages: [],
    });
  }

  // Enforce history limit to keep context window manageable
  const recentMessages = session.messages.slice(-MAX_CHAT_HISTORY);

  // Append the new user message
  recentMessages.push({ role: 'user', content: message });

  // Call Groq
  let assistantReply;
  try {
    assistantReply = await chatWithAssistant(recentMessages);
  } catch (err) {
    const groqStatus = err?.status || err?.statusCode;
    if (groqStatus === 404 || err?.message?.includes('model')) {
      throw new AppError(
        'The configured AI model is not available on this account. Please update GROQ_MODEL in your environment configuration.',
        503,
      );
    }
    if (groqStatus === 429) {
      throw new AppError('AI service rate limit reached. Please try again later.', 429);
    }
    throw new AppError('AI assistant is temporarily unavailable. Please try again later.', 503);
  }

  // Persist both messages to the session
  session.messages.push(
    { role: 'user', content: message },
    { role: 'assistant', content: assistantReply },
  );

  // Trim persisted messages to the last MAX_CHAT_HISTORY * 2 entries
  if (session.messages.length > MAX_CHAT_HISTORY * 2) {
    session.messages = session.messages.slice(-(MAX_CHAT_HISTORY * 2));
  }

  await session.save();

  return sendSuccess(res, 200, 'AI response generated.', {
    sessionId: session._id,
    reply: assistantReply,
    disclaimer: AI_DISCLAIMER,
  });
});

// ── GET /api/ai/sessions ──────────────────────
export const getSessions = asyncHandler(async (req, res) => {
  const sessions = await ChatSession.find({ userId: req.user._id })
    .select('title createdAt updatedAt')
    .sort({ updatedAt: -1 })
    .limit(50)
    .lean();

  return sendSuccess(res, 200, 'Chat sessions retrieved.', { sessions });
});

// ── GET /api/ai/sessions/:id ──────────────────
export const getSession = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) throw new AppError('Invalid session ID.', 400);

  const session = await ChatSession.findOne({
    _id: req.params.id,
    userId: req.user._id,
  }).lean();

  if (!session) throw new AppError('Chat session not found.', 404);

  return sendSuccess(res, 200, 'Chat session retrieved.', { session });
});

// ── DELETE /api/ai/sessions/:id ───────────────
export const deleteSession = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) throw new AppError('Invalid session ID.', 400);

  const session = await ChatSession.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!session) throw new AppError('Chat session not found.', 404);

  return sendSuccess(res, 200, 'Chat session deleted.');
});
