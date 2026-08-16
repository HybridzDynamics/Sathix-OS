const rag = require('../integrations/rag.client');
const language = require('../integrations/language.client');
const voice = require('../integrations/voice.client');

const ok = (res, data, message) => res.json({ success: true, data, ...(message ? { message } : {}) });
function validText(value, field, max = 10000) { if (typeof value !== 'string' || !value.trim() || value.length > max) { const error = new Error(`${field} must be a non-empty string no longer than ${max} characters.`); error.status = 422; throw error; } }

async function ragQuery(req, res, next) { try { validText(req.body?.query, 'query', 4000); const data = await rag.query({ query: req.body.query.trim(), language: req.body.language || 'en', filters: req.body.filters || {}, topK: Math.min(20, Math.max(1, Number(req.body.topK) || 5)), requestId: req.id }); ok(res, { answer: data.answer || '', sources: data.sources || [], documents: data.documents || [] }); } catch (error) { next(error); } }
async function detect(req, res, next) { try { validText(req.body?.text, 'text'); ok(res, await language.detect(req.body.text, req.id)); } catch (error) { next(error); } }
async function translate(req, res, next) { try { validText(req.body?.text, 'text'); validText(req.body?.sourceLanguage, 'sourceLanguage', 20); validText(req.body?.targetLanguage, 'targetLanguage', 20); ok(res, await language.translate({ text: req.body.text, sourceLanguage: req.body.sourceLanguage, targetLanguage: req.body.targetLanguage }, req.id)); } catch (error) { next(error); } }
async function supportedLanguages(req, res, next) { try { ok(res, await language.languages()); } catch (error) { next(error); } }
async function voiceLanguages(req, res, next) { try { ok(res, await voice.languages()); } catch (error) { next(error); } }
async function synthesize(req, res, next) { try { validText(req.body?.text, 'text', 5000); const result = await voice.synthesize({ text: req.body.text, language: req.body.language, voice: req.body.voice, modelId: req.body.modelId }, req.id); res.set('Content-Type', result.headers['content-type'] || 'audio/mpeg'); res.set('X-Request-ID', req.id); res.send(Buffer.from(result.data)); } catch (error) { next(error); } }
async function transcribe(req, res, next) { try { if (!req.is('multipart/form-data')) { const error = new Error('Content-Type must be multipart/form-data.'); error.status = 415; throw error; } ok(res, await voice.transcribe(req, { 'content-type': req.headers['content-type'] }, req.id)); } catch (error) { next(error); } }
module.exports = { ragQuery, detect, translate, supportedLanguages, voiceLanguages, synthesize, transcribe };
