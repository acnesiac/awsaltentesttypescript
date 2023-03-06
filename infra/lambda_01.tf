data "archive_file" "lambda_function_01" {
  type        = "zip"
  source_file = "${path.module}/../aws-simple-backend-assignment-typescript.zip"
  output_path = "${path.module}/../aws-simple-backend-assignment-typescript.zip"
}

resource "aws_lambda_function" "my_lambda_function_01" {
  filename         = data.archive_file.lambda_function_01.output_path
  function_name    = "my-lambda-function-parse-each-line-${var.APP}-${var.ENV}"
  handler          = "app.s3ToSqsHandler"
  runtime          = "nodejs14.x"
  role             = aws_iam_role.my_lambda_role.arn
  timeout          = 10
  memory_size      = 256
  source_code_hash = filebase64sha256(data.archive_file.lambda_function_01.output_path)

  environment {
    variables = {
      "APP" = var.APP,
      "ENV" = var.ENV,
      "AWS_ACCOUNT_ID" = var.AWS_ACCOUNT_ID,
      "QUEUE_URL" = aws_sqs_queue.my_sqs.url
    }
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_lambda_permission" "test" {
  statement_id  = "AllowS3Invoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.my_lambda_function_01.function_name
  principal     = "s3.amazonaws.com"
  source_arn    = "arn:aws:s3:::${aws_s3_bucket.my_bucket.id}"
}
