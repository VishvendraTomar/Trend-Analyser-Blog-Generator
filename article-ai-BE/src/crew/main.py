from dotenv import load_dotenv
load_dotenv()

from .crew import ArticlePostCrew
import os
from datetime import datetime
from .database import Database
import argparse




print("The model we are uasing is",os.getenv("MODEL"))
def run():
    # Parse command line arguments
    parser = argparse.ArgumentParser()
    parser.add_argument('--execution-id', type=int, help='Execution ID from API')
    args = parser.parse_args()

    # Get active configuration
    db = Database()
    config = db.get_active_config()
    
    # Use existing execution_id instead of creating a new one
    execution_id = args.execution_id

    try:
        # Create execution log entry - This is creating a duplicate entry
        execution_id = db.insert_execution_log(
            config_id=config['id'],
            status="STARTED",
            message=f"Execution started @ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} "
        )

        inputs = {
            "company_name":"Geekyants",
            "target_audience":"Developer",
            "business_objectives":"TO help developer use GenAI integration",
            "audience_description":"",
            "industry":"Healthcare",
            "audience_needs":"",
            "organization_overview":"",
        }
        data = ArticlePostCrew().crew().kickoff(inputs=inputs)
        print(data)

        # Update the execution status when complete
        db.update_execution_log(
            execution_id,
            status="COMPLETED",
            message="Article generation completed successfully"
        )
        
        # Store the generated content
        if data:
            db.insert_blog_post(
                config_id=config['id'],
                execution_log_id=execution_id,
                content=str(data)
            )
            
    except Exception as e:
        db.update_execution_log(
            execution_id,
            status="FAILED",
            message=f"Article generation failed: {str(e)}"
        )
        raise e