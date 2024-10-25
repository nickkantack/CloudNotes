import json
import boto3
import os

def lambda_handler(event, context):
    # Specify your S3 bucket name and the file name to read
    bucket_name = os.environ['BUCKET_NAME']  # Set this in your Lambda environment variables
    file_name = os.environ['FILE_NAME']      # Set this in your Lambda environment variables

    # Initialize S3 client
    s3_client = boto3.client('s3')

    try:
        # Get the object from S3
        response = s3_client.get_object(Bucket=bucket_name, Key=file_name)
        
        # Read the file contents and parse the JSON
        file_contents = response['Body'].read().decode('utf-8')
        json_data = json.loads(file_contents)
        
        return {
            'statusCode': 200,
            'body': json.dumps(json_data)
        }
        
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