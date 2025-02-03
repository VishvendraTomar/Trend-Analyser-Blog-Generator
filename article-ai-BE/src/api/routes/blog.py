from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from ..schemas.blog import BlogPostResponse, BlogPostRequest
from ..dependencies.database import get_database
from src.database.database import Database

router = APIRouter(
    prefix="/blog",
    tags=["Blog Posts"]
)

@router.get("/execution/{execution_id}", response_model=BlogPostResponse)
async def get_blog_by_execution_id(
    execution_id: int,
    db: Database = Depends(get_database)
):
    """
    Get blog post by execution ID
    """
    try:
        blog_post = db.get_blog_post_by_execution_id(execution_id)
        if not blog_post:
            raise HTTPException(
                status_code=404, 
                detail=f"Blog post not found for execution ID {execution_id}"
            )
        
        return BlogPostResponse(**blog_post)
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 
    
@router.put("/{blog_post_id}", response_model=BlogPostResponse)
async def update_blog_post(
    blog_post_id: int,
    blog_post: BlogPostRequest,
    db: Database = Depends(get_database)
):
    try:
        db.update_blog_post(blog_post_id, blog_post.content)
        return db.get_blog_post(blog_post_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))