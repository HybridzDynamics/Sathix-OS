FROM python:3.11-slim
WORKDIR /app
COPY python/stt/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY python/stt/main.py ./main.py
EXPOSE 8002
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD python -c "from urllib.request import urlopen; urlopen('http://127.0.0.1:8002/health').read()"
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8002"]
