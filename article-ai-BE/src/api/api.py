from fastapi import FastAPI
from datetime import datetime
from .routes import config, execution, blog, agent

# add cors middleware
from fastapi.middleware.cors import CORSMiddleware




app = FastAPI(
    title="Article AI API",
    description="API for managing article configurations and generation",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(config.router)
app.include_router(execution.router)
app.include_router(blog.router)
app.include_router(agent.router)

# Health Check
@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint
    """
    return {"status": "healthy", "timestamp": datetime.now()}
