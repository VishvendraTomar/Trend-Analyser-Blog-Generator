from fastapi import APIRouter, Depends, HTTPException
from typing import List
from ..schemas.execution import ExecutionLogResponse
from ..dependencies.database import get_database
from src.database.database import Database

router = APIRouter(
    prefix="/execution",
    tags=["Execution Logs"]
)

@router.get("/", response_model=List[ExecutionLogResponse])
async def get_execution_logs(
    db: Database = Depends(get_database)
):
    """
    Get all execution logs
    """
    try:
        logs = db.get_execution_logs()
        if not logs:
            return []
        
        for log in logs:
            config = db.get_config(log['config_id'])
            log['config'] = config
        
        # Convert the tuple results to dictionaries
        
        return [ExecutionLogResponse(**log) for log in logs]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 