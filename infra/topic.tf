resource "aws_sns_topic" "my_sns_topic" {
  name = "sns_topic-${var.APP}-${var.ENV}.fifo"
  fifo_topic = true
}
