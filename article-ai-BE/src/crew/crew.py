from crewai.project import (
    CrewBase, 
    agent, 
    crew, 
    task
)
from crewai import (
    Agent,
    Crew, 
    Process, 
    Task
)
from crewai_tools.tools import (
    SerperDevTool,
    YoutubeVideoSearchTool,
    WebsiteSearchTool,
    ScrapeWebsiteTool,
)
from .tools.fetch_posted_blogs import FetchPostedBlogs

@CrewBase
class ArticlePostCrew:
    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    @agent
    def marketing_manager(self):
        return Agent(
            config=self.agents_config["marketing_manager"],
            tools=[],
            allow_delegation=False,
            verbose=True,
        )
    
    @agent
    def market_research_analyst(self):
        return Agent(
            config=self.agents_config["market_research_analyst"],
            tools=[
                FetchPostedBlogs(),
                SerperDevTool(),
                YoutubeVideoSearchTool(),
                WebsiteSearchTool(),
                ScrapeWebsiteTool(),  
            ], 
            allow_delegation=False,
            verbose=True,
        )
    
    @agent
    def seo_expert(self):
        return Agent(
            config=self.agents_config["seo_expert"],
            tools=[],
            allow_delegation=False,
            verbose=True,
        )
    
    @agent
    def content_analyst(self):
        return Agent(
            config=self.agents_config["content_analyst"],
            tools=[FetchPostedBlogs()],
            allow_delegation=False,
            verbose=True,
        )
    
    @agent
    def content_strategist(self):
        return Agent(
            config=self.agents_config["content_strategist"],
            tools=[],
            allow_delegation=False,
            verbose=True,
        )
    
    @agent
    def content_creator(self):
        return Agent(
            config=self.agents_config["content_creator"],
            tools=[],
            allow_delegation=False,
            verbose=True,
        )
    
    @agent
    def content_editor(self):
        return Agent(
            config=self.agents_config["content_editor"],
            tools=[],
            allow_delegation=False,
            verbose=True,
        )
    
    @task
    def identify_objectives_task(self):
        return Task(
            config=self.tasks_config["identify_objectives_task"],
            agent=self.marketing_manager(),
        )
    
    @task
    def analyze_trends_task(self):
        return Task(
            config=self.tasks_config["analyze_trends_task"],
            agent=self.market_research_analyst(),
        )
    
    @task
    def perform_keyword_research_task(self):
        return Task(
            config=self.tasks_config["perform_keyword_research_task"],
            agent=self.seo_expert(),
        )
    
    @task
    def audit_existing_content_task(self):
        return Task(
            config=self.tasks_config["audit_existing_content_task"],
            agent=self.content_analyst(),
        )
    
    @task
    def create_content_plan_task(self):
        return Task(
            config=self.tasks_config["create_content_plan_task"],
            agent=self.content_strategist(),
        )
    
    @task
    def develop_content_task(self):
        return Task(
            config=self.tasks_config["develop_content_task"],
            agent=self.content_creator(),
        )
    
    @task
    def optimize_and_finalize_task(self):
        return Task(
            config=self.tasks_config["optimize_and_finalize_task"],
            agent=self.content_editor(),
        )
    
    @crew
    def crew(self):
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
            planning=True,
        )
