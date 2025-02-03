from fastapi import APIRouter, Depends, HTTPException
from ..schemas.config import ConfigCreate, ConfigResponse
from ..dependencies.database import get_database
from src.database.database import Database

router = APIRouter(
    prefix="/config",
    tags=["Configuration"]
)

@router.post("/", response_model=ConfigResponse)
async def create_config(
    config: ConfigCreate,
    db: Database = Depends(get_database)
):
    """
    Create a new configuration
    
    - Deactivates any existing active configuration
    - Creates a new configuration with the provided details
    """
    try:
        config_dict = config.model_dump()
        db.insert_config(config_dict)
        # Get the newly created config (it will be the active one)
        new_config = db.get_active_config()
        if not new_config:
            raise HTTPException(status_code=500, detail="Failed to create configuration")
        return ConfigResponse(**new_config)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/active", response_model=ConfigResponse)
async def get_active_config(
    db: Database = Depends(get_database)
):
    """
    Get the currently active configuration
    """
    try:
        print("Getting active config")
        config = db.get_active_config()
        print(config)
        if not config:
            raise HTTPException(status_code=404, detail="No active configuration found")
        return ConfigResponse(**config)
    except HTTPException as he:
        raise he
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{config_id}", response_model=ConfigResponse)
async def get_config(
    config_id: int,
    db: Database = Depends(get_database)
):
    """
    Get a specific configuration by ID
    """
    try:
        config = db.get_config(config_id)
        if not config:
            raise HTTPException(status_code=404, detail=f"Configuration with ID {config_id} not found")
        return ConfigResponse(**config)
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 