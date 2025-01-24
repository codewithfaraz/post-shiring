import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  "https://eovldhwgfqaizrfdjzuq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvdmxkaHdnZnFhaXpyZmRqenVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3MzQ0MDIsImV4cCI6MjA1MDMxMDQwMn0.qCHN8rrfGN7aP5b63fx8dIQSYcmPRblEc6dLeXvc1lE"
);
export default supabase;
