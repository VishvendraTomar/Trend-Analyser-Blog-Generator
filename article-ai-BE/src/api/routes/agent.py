from fastapi import APIRouter, Depends, HTTPException
from ..dependencies.database import get_database
from src.database.database import Database
import asyncio
from concurrent.futures import ThreadPoolExecutor
import subprocess
from datetime import datetime
from pathlib import Path

router = APIRouter(
    prefix="/agent",
    tags=["AI Agents"]
)

@router.post("/trigger")
async def trigger_article_generation(
    db: Database = Depends(get_database)
):
    """
    Trigger the article generation process
    """
    try:
        # Get active configuration
        config = db.get_active_config()
        if not config:
            raise HTTPException(
                status_code=404,
                detail="No active configuration found. Please create a configuration first."
            )

        async def run_article_agent():
            try:
                # Get the project root directory
                project_root = Path(__file__).parent.parent.parent.parent
                
                # Create a process pool for running the command
                loop = asyncio.get_event_loop()
                with ThreadPoolExecutor() as pool:
                    # Run the command in the process pool
                    process = await loop.run_in_executor(
                        pool,
                        lambda: subprocess.Popen(
                            ["uv", "run", "article_post_agent"],
                            cwd=str(project_root),
                            stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE
                        )
                    )
                    
                    # Wait for process to complete
                    stdout, stderr = await loop.run_in_executor(pool, process.communicate)
                    
                    if process.returncode != 0:
                        error_msg = stderr.decode() if stderr else "Unknown error occurred"
                        raise HTTPException(
                            status_code=500,
                            detail=f"Article generation failed: {error_msg}"
                        )
                        
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))

        # Start the async task
        asyncio.create_task(run_article_agent())

        return {
            "message": "Article generation started successfully"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 