from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

from .database.database import Database
from .crew import ArticlePostCrew


def job():
    db = Database()
    config = db.get_active_config()
    execution_log_id = None
    try:
        if config:            
            config_id = config['id']
            status = 'running'
            message = 'Execution started @ ' + datetime.now().strftime('%Y-%m-%d %H:%M:%S %Z')

            print(config)
            
            execution_log_id = db.insert_execution_log(config_id, status, message)

            # Generate the blog post

            inputs = {
                "company_name": config['company_name'],
                "target_audience": config['target_audience'],
                "business_objectives": config['business_objectives'],
                "audience_description": config['audience_description'],
                "industry": config['industry'],
                "audience_needs": config['audience_needs'],
                "organization_overview": config['organization_overview'],
            }

            data = ArticlePostCrew().crew().kickoff(inputs=inputs)

            first_line = data.raw.split('\n')[0]

            db.insert_blog_post(config_id, execution_log_id, data.raw)

            db.update_execution_log(execution_log_id, 'success', first_line)
        else:
            print("No active configuration found")
    except Exception as e:
        
        if execution_log_id:
            db.update_execution_log(execution_log_id, 'error', str(e))

        raise e
