FROM python:3.11-slim
WORKDIR /app
COPY python/stt/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY python/stt/main.py ./main.py
EXPOSE 8002
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8002"]
