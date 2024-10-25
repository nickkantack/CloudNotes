import json
import boto3
import time
import math

def lambda_handler(event, context):

    if "written_timestamp" not in event:
        return {
            'statusCode': 404,
            'body': "payload must include \"written_timestamp\""
        }
    incoming_timestamp = event["written_timestamp"]

    # Specify your S3 bucket name and the file name to read
    bucket_name = "cloudnotesbucket"
    file_name = "notes.json"

    # Initialize S3 client
    s3_client = boto3.client('s3')

    written_timestamp = None
    try:
        # Get the object from S3
        response = s3_client.get_object(Bucket=bucket_name, Key=file_name)
        
        # Read the file contents and parse the JSON
        file_contents = response['Body'].read().decode('utf-8')
        json_data = json.loads(file_contents)
        written_timestamp = json_data["written_timestamp"]
        
    except s3_client.exceptions.NoSuchKey:
        return {
            'statusCode': 404,
            'body': json.dumps({'error': 'File not found'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }

    if written_timestamp is None:
        return {
            'statusCode': 500,
            'body': "Could not get written_timestamp from file in S3"
        }
    if incoming_timestamp <= written_timestamp:
        return {
            'statusCode': 200,
            'body': "Record superseded by newer data on server."
        }

    # Get the JSON payload from the event
    try:
        payload = json.dumps(event)  # Convert the event to a JSON string
    except (TypeError, ValueError) as e:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid JSON payload'})
        }
    
    # Initialize S3 client
    s3_client = boto3.client('s3')
    
    # Write the payload to the specified file in S3
    try:
        s3_client.put_object(Bucket=bucket_name, Key=file_name, Body=payload)
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Payload written to S3 successfully!'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }