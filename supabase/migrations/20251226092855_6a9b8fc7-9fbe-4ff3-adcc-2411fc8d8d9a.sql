-- Enable realtime for submission status updates
ALTER PUBLICATION supabase_realtime ADD TABLE stylebox_submissions;

-- Enable realtime for job postings
ALTER PUBLICATION supabase_realtime ADD TABLE jobs;

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Enable realtime for production queue updates
ALTER PUBLICATION supabase_realtime ADD TABLE production_queue;
ALTER PUBLICATION supabase_realtime ADD TABLE portfolio_publications;

-- Set REPLICA IDENTITY FULL for complete row data on updates
ALTER TABLE stylebox_submissions REPLICA IDENTITY FULL;
ALTER TABLE jobs REPLICA IDENTITY FULL;
ALTER TABLE notifications REPLICA IDENTITY FULL;
ALTER TABLE production_queue REPLICA IDENTITY FULL;
ALTER TABLE portfolio_publications REPLICA IDENTITY FULL;