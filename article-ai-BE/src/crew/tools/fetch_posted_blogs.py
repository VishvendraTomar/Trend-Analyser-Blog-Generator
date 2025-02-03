from crewai.tools import BaseTool
from pydantic import BaseModel, Field
from typing import Type, List
from tabulate import tabulate
import requests
import pandas as pd
import os

class FetchBlogInput(BaseModel):
    category: str = Field(
        description="Blog category (technology/business/news/other)",
        default="technology",
    )
    page: int = Field(
        description="Page number for pagination",
        default=1
    )

class FetchPostedBlogs(BaseTool):
    name: str = "Fetch Posted Blogs"
    description: str = "Fetches blog posts from the GeekyAnts website and returns them in a markdown table format"
    args_schema: Type[FetchBlogInput] = FetchBlogInput
    base_url: str = "https://website-admin.geekyants.com/api/blog"

    def __init__(self):
        super().__init__()

    def _fetch_blogs(self, category: str, page: int = 1) -> dict:
        url = f"{self.base_url}/{category}?page={page}"
        response = requests.get(url)
        return response.json()

    def _format_to_markdown_table(self, articles: List[dict]) -> str:
        # Extract required fields
        data = [{
            'id': article['id'],
            'title': article['title'],
            'short_description': article['short_description'],
            'slug': article['slug']
        } for article in articles]
        
        # Convert to DataFrame for easy table formatting
        df = pd.DataFrame(data)
        
        # Convert DataFrame to markdown table
        markdown_table = tabulate(df, headers='keys', tablefmt='pipe', showindex=False)
        return markdown_table

    def _run(self, category: str = "technology", page: int = 1) -> str:
        """
        Fetch blogs and return them in markdown table format
        
        Args:
            category (str): Blog category (technology/business/news/other)
            page (int): Page number for pagination
            
        Returns:
            str: Markdown formatted table with blog data
        """
        try:
            response_data = self._fetch_blogs(category, page)
            if response_data.get('success'):
                articles = response_data['result']['articles']['data']
                return self._format_to_markdown_table(articles)
            else:
                return "Error: Failed to fetch blog data"
        except Exception as e:
            return f"Error: {str(e)}"

    def _format_results(self, results: list[tuple]) -> str:
        headers = ["id", "title", "published_date", "author", "summary", "topics"]
        table = tabulate(results, headers=headers, tablefmt="grid")
        return table
