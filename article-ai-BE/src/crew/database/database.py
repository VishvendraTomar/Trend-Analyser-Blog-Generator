import sqlite3
from typing import List, Dict, Optional
import os
from datetime import datetime

class Database:
    def __init__(self, db_path: str = "blog_posts.db"):
        """Initialize database connection"""
        self.db_path = db_path
        self._create_tables()

    def _create_tables(self):
        """Create necessary tables if they don't exist"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        

        # Create categories table for better organization
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS config (
            id INTEGER PRIMARY KEY,
            company_name TEXT,
            target_audience TEXT,
            business_objectives TEXT,
            audience_description TEXT,
            industry TEXT,
            audience_needs TEXT,
            organization_overview TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT TRUE
        )
        ''')

        # Execution log table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS execution_log (
            id INTEGER PRIMARY KEY,
            config_id INTEGER,
            execution_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status TEXT,
            message TEXT,
            FOREIGN KEY (config_id) REFERENCES config(id)
        )
        ''')
        

        # Create blog_posts table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS blog_posts (
            id INTEGER PRIMARY KEY,
            content TEXT,
            config_id INTEGER,
            execution_log_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (config_id) REFERENCES config(id),
            FOREIGN KEY (execution_log_id) REFERENCES execution_log(id)
        )
        ''')



        
        conn.commit()
        conn.close()

    def insert_config(self, config: Dict):
        """Insert a new configuration into the database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        # update the config table existing config as disabled
        cursor.execute('UPDATE config SET is_active = FALSE WHERE is_active = TRUE')

        # insert new config
        cursor.execute('INSERT INTO config (company_name, target_audience, business_objectives, audience_description, industry, audience_needs, organization_overview) VALUES (?, ?, ?, ?, ?, ?, ?)', (config['company_name'], config['target_audience'], config['business_objectives'], config['audience_description'], config['industry'], config['audience_needs'], config['organization_overview']))

        conn.commit()
        conn.close()

    def _map_config(self, config: Dict | None) -> Dict | None:
        """Map the config to the database schema"""
        if config is None:
            return None

        return {
            'id': config[0],
            'company_name': config[1],
            'target_audience': config[2],
            'business_objectives': config[3],
            'audience_description': config[4],
            'industry': config[5],
            'audience_needs': config[6],
            'organization_overview': config[7],
            'is_active': config[8],
            'created_at': config[9],
            'updated_at': config[10]
        }

    def get_active_config(self) -> Dict:
        """Get the active configuration"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('SELECT id, company_name, target_audience, business_objectives, audience_description, industry, audience_needs, organization_overview, is_active, created_at, updated_at FROM config WHERE is_active = TRUE')
        config = cursor.fetchone()
        conn.close()
        return self._map_config(config)
    
    def get_config(self, config_id: int) -> Dict:
        """Get a specific configuration by ID"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('SELECT id, company_name, target_audience, business_objectives, audience_description, industry, audience_needs, organization_overview, is_active, created_at, updated_at FROM config WHERE id = ?', (config_id,))
        config = cursor.fetchone()
        conn.close()
        return self._map_config(config)
    

    def insert_execution_log(self, config_id: int, status: str, message: str):
        """Insert a new execution log into the database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('INSERT INTO execution_log (config_id, status, message) VALUES (?, ?, ?)', (config_id, status, message))
        conn.commit()
        conn.close()

        return cursor.lastrowid
    
    def update_execution_log(self, execution_log_id: int, status: str, message: str):
        """Update an existing execution log in the database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('UPDATE execution_log SET status = ?, message = ? WHERE id = ?', (status, message, execution_log_id))
        conn.commit()
        conn.close()

    def _map_execution_log(self, execution_log: Dict | None) -> Dict | None:
        """Map the execution log to the database schema"""
        if execution_log is None:
            return None
        
        return {
            'id': execution_log[0],
            'config_id': execution_log[1],
            'execution_date': execution_log[2],
            'status': execution_log[3],
            'message': execution_log[4]
        }

    def get_execution_logs(self) -> List[Dict]:
        """Get all execution logs"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('SELECT id, config_id, execution_date, status, message FROM execution_log ORDER BY execution_date DESC')
        execution_logs = cursor.fetchall()
        conn.close()
        return [self._map_execution_log(log) for log in execution_logs]
    
    def insert_blog_post(self, config_id: int, execution_log_id: int, content: str):
        """Insert a new blog post into the database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('INSERT INTO blog_posts (config_id, content, execution_log_id) VALUES (?, ?, ?)', (config_id, content, execution_log_id))
        conn.commit()
        conn.close()

    def _map_blog_post(self, blog_post: Dict | None) -> Dict | None:
        """Map the blog post to the database schema"""
        if blog_post is None:
            return None
        
        return {
            'id': blog_post[0],
            'content': blog_post[1],
            'config_id': blog_post[2],
            'execution_log_id': blog_post[3],
            'created_at': blog_post[4],
            'updated_at': blog_post[5]
        }

    def get_blog_post(self, blog_post_id: int) -> Dict:
        """Get a specific blog post by ID"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('SELECT id, content, config_id, execution_log_id, created_at, updated_at FROM blog_posts WHERE id = ?', (blog_post_id,))
        blog_post = cursor.fetchone()
        conn.close()
        return blog_post

