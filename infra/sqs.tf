resource "aws_sqs_queue" "my_sqs" {
  name = "sqs-${var.APP}-${var.ENV}.fifo"
  fifo_queue = true
  content_based_deduplication = true
}

resource "aws_sns_topic_subscription" "my_sns_topic_subscription" {
  topic_arn = aws_sns_topic.my_sns_topic.arn
  protocol = "sqs"
  endpoint = aws_sqs_queue.my_sqs.arn
  endpoint_auto_confirms = true
}
