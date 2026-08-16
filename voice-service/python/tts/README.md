# TTS adapters

The `python-http` provider sends `POST /v1/tts/synthesize` with `{ text, language, voice }` and `X-Model-Id`. Return audio bytes with an appropriate `Content-Type` such as `audio/wav`.

Voice artifact licensing must be approved before a model is enabled in production.
