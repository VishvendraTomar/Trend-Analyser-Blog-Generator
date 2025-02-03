from functools import lru_cache
from ...database.database import Database

@lru_cache()
def get_database() -> Database:
    """
    Get database instance with caching
    """
    return Database() 