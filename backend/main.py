from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import json
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types

# Get the absolute path to the backend directory
BASE_DIR = Path(__file__).resolve().parent
env_path = BASE_DIR / ".env"

# Load the environment variables explicitly from backend/.env
load_dotenv(dotenv_path=env_path)

app = FastAPI(title="AuraWrite AI Backend")

# Allow requests from the Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PostRequest(BaseModel):
    bullet_points: str
    tone: str
    length: str
    include_hashtags: bool
    include_emojis: bool

class IdeaRequest(BaseModel):
    category: str

class EnhanceRequest(BaseModel):
    original_post: str
    make_shorter: bool
    make_professional: bool
    make_engaging: bool
    add_emojis: bool

@app.post("/generate")
async def generate_post(req: PostRequest):
    # Reload env vars just in case they were changed during runtime
    load_dotenv(dotenv_path=env_path, override=True)
    api_key = os.environ.get("GEMINI_API_KEY")
    
    if api_key:
        # Remove any surrounding whitespace and quotes that might have been accidentally included
        api_key = api_key.strip().strip('\"\'')
        
    if not api_key or api_key == "your_gemini_api_key_here" or api_key == "your_actual_api_key":
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured correctly. Please check your backend/.env file.")

    try:
        client = genai.Client(api_key=api_key)
        
        system_instruction = f"""You are an expert LinkedIn post copywriter.
You transform raw bullet points into highly engaging, optimized LinkedIn posts.
Your writing style is highly effective, engaging, and professional.

Instructions for this generation:
- Tone: {req.tone}
- Length: {req.length}
- Include Emojis: {"Yes" if req.include_emojis else "No (Strictly forbid using any emojis)"}
- Include Hashtags: {"Yes, add 3-5 relevant hashtags at the end" if req.include_hashtags else "No (Strictly forbid using any hashtags)"}

Please write the post directly without any intro or outro text like "Here is your post:"."""

        prompt = f"Transform the following bullet points into a LinkedIn post:\n\n{req.bullet_points}"

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.7,
            )
        )
        
        return {"post": response.text}

    except Exception as e:
        print(f"Error generating post: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-ideas")
async def generate_ideas(req: IdeaRequest):
    load_dotenv(dotenv_path=env_path, override=True)
    api_key = os.environ.get("GEMINI_API_KEY")
    
    if api_key:
        api_key = api_key.strip().strip('\"\'')
        
    if not api_key or api_key == "your_gemini_api_key_here" or api_key == "your_actual_api_key":
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured correctly. Please check your backend/.env file.")

    try:
        client = genai.Client(api_key=api_key)
        
        system_instruction = f"""You are an expert LinkedIn content strategist.
The user wants content ideas for the category: {req.category}.
You must generate exactly 3 Post Ideas, 3 Hooks, and 3 Trending Topics for this category.
Return the output strictly as a JSON object with this exact schema:
{{
  "post_ideas": [
    {{"title": "Idea 1 Title", "description": "Detailed description of the post idea."}},
    {{"title": "Idea 2 Title", "description": "Detailed description of the post idea."}},
    {{"title": "Idea 3 Title", "description": "Detailed description of the post idea."}}
  ],
  "hooks": [
    "Hook 1",
    "Hook 2",
    "Hook 3"
  ],
  "trending_topics": [
    "Topic 1",
    "Topic 2",
    "Topic 3"
  ]
}}"""

        prompt = f"Generate LinkedIn ideas for the category: {req.category}"

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.8,
                response_mime_type="application/json",
            )
        )
        
        return json.loads(response.text)

    except Exception as e:
        print(f"Error generating ideas: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/enhance-post")
async def enhance_post(req: EnhanceRequest):
    load_dotenv(dotenv_path=env_path, override=True)
    api_key = os.environ.get("GEMINI_API_KEY")
    
    if api_key:
        api_key = api_key.strip().strip('\"\'')
        
    if not api_key or api_key == "your_gemini_api_key_here" or api_key == "your_actual_api_key":
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured correctly. Please check your backend/.env file.")

    try:
        client = genai.Client(api_key=api_key)
        
        system_instruction = "You are an expert LinkedIn copywriter. Your goal is to significantly enhance the user's provided LinkedIn post. Improve the hook, readability, engagement, hashtags, and formatting."
        
        modifiers = []
        if req.make_shorter:
            modifiers.append("Make the post noticeably shorter and more concise.")
        if req.make_professional:
            modifiers.append("Adopt a highly professional, authoritative tone.")
        if req.make_engaging:
            modifiers.append("Make the content highly engaging, encouraging comments and discussion.")
        if req.add_emojis:
            modifiers.append("Include relevant emojis throughout the post.")
        else:
            modifiers.append("Strictly DO NOT use any emojis.")

        prompt = f"Original Post:\n\n{req.original_post}\n\nEnhancement Instructions:\n" + "\n".join(f"- {m}" for m in modifiers) + "\n\nReturn ONLY the enhanced post directly without any intro/outro text."

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.7,
            )
        )
        
        return {"post": response.text}

    except Exception as e:
        print(f"Error enhancing post: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
